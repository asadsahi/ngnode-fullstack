let passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    DB = require('../../../db/models'),
    User = DB.User;

module.exports = () => {
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: appConfig.Security.JWT_SECRET
    };
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne(
            {
                include: [
                    { model: DB.Role },
                    { model: DB.UserImage, attributes: ['id'] }
                ],
                where: {
                    id: jwt_payload.user.id
                }
            })
            .then(user => {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                    // or you could create a new account
                }
            })
            .catch(err => done(err, false))
    }));

};
