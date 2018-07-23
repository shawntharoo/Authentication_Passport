var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');
var myLocalConfig = (passport) => {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase();
            process.nextTick(function () {
                User.findOne({ 'local.email': email }, function (err, user) {
                    if (err)
                        return done(err);

                    if (!user)
                        return done(null, false);

                    if (!user.validPassword(password))
                        return done(null, false);

                    else
                        return done(null, user);
                });
            });
        }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase();
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({ 'local.email': email }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, false)
                        } else {
                            var newUser = new User();
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.fname = req.body.fname
                            newUser.lname = req.body.lname;
                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }

                    });

                } else if (!req.user.local.email) {
                    User.findOne({ 'local.email': email }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(nul, false);
                        } else {
                            var user = req.user;
                            user.local.email = email;
                            user.local.password = user.generateHash(password);
                            user.fname = req.body.fname;
                            user.lname = req.body.lname;
                            user.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            })
                        }
                    })
                } else {
                    return done(null, req.user);
                }
            })
        }))
}

module.exports = myLocalConfig;