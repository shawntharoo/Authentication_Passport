var express = require('express');
var router = express.Router();
var con = require('../../config/database');

router.get('/guest', (req, res) => {
    res.status(200).json({
        'message': "This is not secured guest routing"
    });
});

router.get('/user', isLoggedIn, (req, res) => {
    res.status(200).json({
        'message': "This is secured user routing"
    });
});

module.exports = router;

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.status(400).json({
        'message': 'access denied'
    });
}
