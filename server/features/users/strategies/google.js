let passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  users = require('../user.controller');

module.exports = () => {
  // Use google strategy
  passport.use(new GoogleStrategy({
    clientID: appConfig.google.clientID,
    clientSecret: appConfig.google.clientSecret,
    callbackURL: appConfig.google.callbackURL,
    passReqToCallback: true
  },
    (req, accessToken, refreshToken, profile, done) => {
      // Set the provider data and include tokens
      let providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      let providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        profileImageURL: (providerData.picture) ? providerData.picture : undefined,
        provider: 'google',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};
