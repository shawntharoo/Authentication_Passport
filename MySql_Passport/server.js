require('dotenv').config();
require('dotenv').load();

var cors = require('cors');
var express = require('express');
var app = express();
var path = require('path');
var passport = require('passport');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
var server = require('http').Server(app);
var flash    = require('connect-flash');

var authRoutes = require('./routes/auth');
var testRotes = require('./routes/test');
var con = require('./config/database');
var config = require('./config/config.js');
require('./config/passport') (passport)

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const options = {
    checkExpirationInterval: 1000 * 60 * 15,// 15 min // How frequently expired sessions will be cleared; milliseconds.
    expiration: 1000 * 60 * 60 * 24 * 7,// 1 week // The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

 const sessionStore = new MySQLStore(options,con);


con.connect(function(err){
    if(err) {
        throw err;
    } else {
        console.log("Connected!");
    }
});

app.use(session({
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true
}));
var port = config.PORT || 5151;

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/auth', authRoutes);
app.use('/test', testRotes);

con.query('USE '+ process.env.SQLDATABASE);
app.listen(port);
console.log("Magic happening on port " + port);