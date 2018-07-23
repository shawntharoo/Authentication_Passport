var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var authRoutes = require('./routes/auth');
var testRotes = require('./routes/test');
var configDB = require('./config/database');

mongoose.connect(configDB.url);

require('./config/passport') (passport)

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'eminem',
    resave: true,
    saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/test', testRotes);

app.listen(port);
console.log('The maggic happens on port ' + port);