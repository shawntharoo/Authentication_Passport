var express = require('express');
var router = express.Router();
var passport = require('passport');
var profile = require('./profile');

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/auth/profile',
    failureRedirect : 'auth/signup'
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/auth/profile',
    failureRedirect : 'auth/login'
}));

router.get('/profile', isLoggedIn, profile.profile)

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.send(200).json({
        'message' : 'successfully logout'
    });
});


module.exports = router;


function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
    return next();

    res.status(400).json({
        'message' : 'access denied'
    });
}
