let path = require('path'),
    fs = require('fs'),
    passport = require('passport'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    DB = require('../../db/models'),
    User = DB.User,
    UserImage = DB.UserImage,
    errorHandler = require('../core/errorHandler');

// =================== OAUTH ROUTES ====================

// URLs for which user can't be redirected on signin
let noReturnUrls = [
    '/authentication/signin',
    '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = (req, res) => {
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    var model = Object.assign(req.body, { provider: 'local' });
    User.create(model)
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            res.status(400).send(err);
        });
};

/**
 * Signin after passport authentication
 */
exports.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
            res.status(400).send(errorHandler.formatMessage('Incorrect credentials'));
        } else {
            // res.json(user);
            //user has authenticated correctly thus we create a JWT token 
            signInUser(user, res);
        }
    })(req, res, next);
};

/**
 * Signout
 */
exports.signout = (req, res) => {
    req.logout();
    res.status(200).json({});
};

/** 
 * OAuth provider call
 */
exports.oauthCall = (strategy, scope) => {
    return (req, res, next) => {
        // Not needed as this is now jwt based and not session based
        // if (req.query && req.query.redirect_to)
        //   req.session.redirect_to = req.query.redirect_to;

        // Authenticate
        passport.authenticate(strategy, scope)(req, res, next);
    };
};

/**
 * OAuth callback
 */
exports.oauthCallback = (strategy) => {
    return (req, res, next) => {

        // info.redirect_to contains inteded redirect path
        passport.authenticate(strategy, (err, user, info) => {
            if (err) {
                return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.formatMessage(err)));
            }
            if (!user) {
                return res.redirect('/authentication/signin');
            }
            // TODO redirect to home page with user
            let token = jwt.sign({ user: user }, appConfig.Security.JWT_SECRET);
            return res.redirect(appConfig.Host + '?token=' + token);
        })(req, res, next);
    };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = (req, providerUserProfile, done) => {
    // Setup info object
    let info = {};

    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    // if (noReturnUrls.indexOf(req.session.redirect_to) === -1)
    //   info.redirect_to = req.session.redirect_to;

    if (!req.user) {
        // Define a search query fields
        let searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        let searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

        // Define main provider search query
        let mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define additional provider search query
        let additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define a search query to find existing user with current provider profile
        let searchQuery = {
            $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };

        User.findOne(searchQuery, (err, user) => {
            if (err) {
                return done(err);
            } else {
                if (!user) {
                    let possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                    User.findUniqueUsername(possibleUsername, null, (availableUsername) => {
                        user = new User({
                            firstName: providerUserProfile.firstName,
                            lastName: providerUserProfile.lastName,
                            username: availableUsername,
                            displayName: providerUserProfile.displayName,
                            profileImageURL: providerUserProfile.profileImageURL,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });

                        // Email intentionally added later to allow defaults (sparse settings) to be applid.
                        // Handles case where no email is supplied.
                        // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
                        user.email = providerUserProfile.email;

                        // And save the user
                        user.save((err) => {
                            return done(err, user, info);
                        });
                    });
                } else {
                    return done(err, user, info);
                }
            }
        });
    } else {
        // User is already logged in, join the provider data to the existing user
        let user = req.user;

        // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
        if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
            // Add the provider data to the additional provider data field
            if (!user.additionalProvidersData) {
                user.additionalProvidersData = {};
            }

            user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');

            // And save the user
            user.save(err => {
                return done(err, user, info);
            });
        } else {
            return done(new Error('User is already connected using this provider'), user);
        }
    }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = (req, res, next) => {
    let user = req.user;
    let provider = req.query.provider;

    if (!user) {
        return res.status(401).json('User is not authenticated');
    } else if (!provider) {
        return res.status(400).send();
    }

    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
        delete user.additionalProvidersData[provider];

        // Then tell mongoose that we've updated the additionalProvidersData field
        user.markModified('additionalProvidersData');
    }

    user.save(err => {
        if (err) {
            return res.status(400).send(errorHandler.formatMessage(err));
        } else {
            req.login(user, err => {
                if (err) {
                    return res.status(400).send(err);
                } else {
                    return res.json(user);
                }
            });
        }
    });
};

// ================== PROFILE ROUTES ================
exports.update = (req, res) => {

    req.user.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email
    })
        .then(user => res.json(_.pick(user, appConfig.whitelistedUserFields)))
        .catch(err => res.status(400).send(errorHandler.formatMessage(err)));
};

/**
 * Get profile picture
 */
exports.getProfilePicture = (req, res) => {
    UserImage.findOne({
        where: {
            id: req.params.id
        }
    }).then((userImage) => {
        if (userImage) {
            res.contentType(userImage.contentType);
            res.send(userImage.data);
        } else {
            res.status(404).send('Not found');
        }
    }, (err) => {
        res.status(400).send(errorHandler.formatMessage(err));
    });
}

/**
 * Update profile picture
 */
exports.changeProfilePicture = (req, res) => {

    req.user.getUserImage()
        .then(image => {
            let promise;
            if (image) {
                promise = image.update({
                    contentType: req.body.mimetype,
                    data: req.body.url
                });
            } else {
                promise = req.user.createUserImage({
                    contentType: req.body.mimetype,
                    data: req.body.url,
                });
            }

            promise.then(img => {
                res.json(img);
            }).catch(err => res.status(400).send('Error while trying to update user picture'));
        })

};

/**
 * Send User
 */
exports.me = (req, res) => {
    let safeUserObject = null;
    if (req.user) {
        safeUserObject = {
            displayName: (req.user.displayName),
            provider: (req.user.provider),
            username: (req.user.username),
            createdAt: req.user.createdAt.toString(),
            roles: req.user.roles,
            profileImageURL: req.user.profileImageURL,
            email: (req.user.email),
            lastName: (req.user.lastName),
            firstName: (req.user.firstName),
            displayName: (req.user.displayName),
            additionalProvidersData: req.user.additionalProvidersData
        };
    } else {
        return res.status(401).send({});
    }

    res.json(safeUserObject || null);
};

// ==================== AUTHORISATION ROUTES ==================

// ====================== USER PASSWORD ROUTES =========================
let smtpTransport = nodemailer.createTransport(appConfig.mailOptions);

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = (req, res, next) => {
    // Create token
    // Save token for user
    // Create reset email
    // Send email

    if (!req.body.username) {
        return res.status(400).send('Username field must not be blank');
    }

    crypto.randomBytes(20, (err, buffer) => {
        let token = buffer.toString('hex');
        if (err) {
            return res.status(400).send('Unable to create encrypted token');
        }
        User.findOne({
            where: {
                email: req.body.username.toLowerCase()
            }
        }).then(user => {
            if (user.provider !== 'local') {
                return res.status(400).send('It seems like you signed up using your ' + user.provider + ' account');
            } else {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save()
                    .then(user => {
                        let httpTransport = req.secure ? 'https://' : 'http://';
                        let baseUrl = req.app.get('domain') || httpTransport + req.headers.host;

                        res.render('reset-password-email', {
                            name: user.displayName,
                            appName: appConfig.appTitle,
                            url: baseUrl + '/api/auth/reset/' + token
                        }, (err, emailHTML) => {
                            if (err) {
                                return res.status(500).send('Unable to create reset token email');
                            }

                            let mailOptions = {
                                to: user.email,
                                from: appConfig.mailOptions.from,
                                subject: 'Password Reset',
                                html: emailHTML
                            };
                            smtpTransport.sendMail(mailOptions, (err) => {
                                if (err) {
                                    return res.status(400).send('Failure sending email');
                                } else {
                                    res.json({
                                        message: 'An email has been sent to the provided email relating to this username with further instructions.'
                                    });
                                }
                            });
                        });
                    }).catch(err => res.status(400).send('Unable to save email reset token for user'));
            }
        }).catch(err => res.status(400).send('No account with that username has been found'));

    });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = (req, res) => {
    User.findOne({
        where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        }
    })
        .then(user => res.redirect('/login/resetpassword?resetToken=' + req.params.token))
        .catch(err => res.redirect('/login/resetpassword'));
};

/**
 * Reset password POST from email token
 */
exports.reset = (req, res, next) => {
    // Check if token is valid
    // Verify both passwords match
    // Update user - clean token
    // Create confirmation email
    // Send email

    let passwordDetails = req.body;

    if (!passwordDetails) {
        return res.status(400).send('Reset details are not provided');
    }

    User.findOne({
        where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        }
    }).then(user => {
        if (passwordDetails.newPassword !== passwordDetails.verifyPassword) {
            return res.status(400).send('Passwords do not match');
        }

        user.update({
            password: user.encryptPassword(passwordDetails.newPassword),
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined
        }).then(user => {
            res.render('reset-password-confirm-email', {
                name: user.displayName,
                appName: appConfig.appTitle
            }, (err, emailHTML) => {
                if (err) {
                    return res.status(500).send('Unable to create reset token email');
                }

                let mailOptions = {
                    to: user.email,
                    from: appConfig.mailOptions.from,
                    subject: 'Your password has been changed',
                    html: emailHTML
                };

                smtpTransport.sendMail(mailOptions, (err) => {
                    if (err) {
                        return res.status(400).send('Failure sending email');
                    }
                    // successfully sent
                    res.json({});
                });
            });
        }).catch(err => {
            return res.status(400).send(errorHandler.formatMessage(err));
        });

    }).catch(error => res.status(400).send('Password reset token is invalid or has expired.'));

};

/**
 * Change Password
 */
exports.changePassword = (req, res, next) => {
    // Init Variables
    let passwordDetails = req.body;

    if (req.user) {
        if (passwordDetails.newPassword) {
            User.findOne({
                where: {
                    id: req.user.id
                }
            }).then(user => {
                if (user.validPassword(passwordDetails.currentPassword)) {
                    if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                        let newPassword = user.encryptPassword(passwordDetails.newPassword);

                        user.update({
                            password: newPassword
                        }, {
                                where: {
                                    id: user.id
                                }
                            }).then(user => {
                                if (!user) {
                                    return res.status(400).send(errorHandler.formatMessage(err));
                                } else {
                                    res.json(['Password changed successfully']);
                                }
                            });
                    } else {
                        res.status(400).send(['Passwords do not match']);
                    }

                } else {
                    res.status(400).send(['Current password is incorrect']);
                }
            }).catch(err => {
                res.status(400).send(['User is not found']);
            });
        } else {
            res.status(400).send('Please provide a new password');
        }
    } else {
        res.status(401).send('User is not signed in');
    }
};

function signInUser(user, res) {
    let userInfo = _.pick(user, [...appConfig.whitelistedUserFields, "id"]);
    let token = jwt.sign({ user: userInfo }, appConfig.Security.JWT_SECRET);
    res.json(token);
}
