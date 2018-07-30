var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');
var bcrypt = require('bcrypt-nodejs');
var con = require('../database');

var myLocalConfig = (passport) => {
    passport.serializeUser(function (user, done) {
        done(null, user.idusers);
    });

    passport.deserializeUser(function (id, done) {
        con.query("select * from users where idusers = "+id,function(err,rows){	
			done(err, rows[0]);
		});
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) { // callback with email and password from our form

        con.query("SELECT * FROM `users` WHERE `email` = '" + email + "'",function(err,rows){
			if (err)
                return done(err);
			 if (rows.length == 0) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            } 
			
			// if the user is found but the password is wrong
            if (!validPassword(rows[0].password, password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			
            // all is well, return successful user
            return done(null, rows[0]);			
		
		});
        }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        con.query("select * from users where email = '"+email+"'",function(err,rows){
			console.log(rows);
			console.log("above row object");
			if (err)
                return done(err);
			 if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUserMysql = new Object();
				
				newUserMysql.email    = email;
                newUserMysql.password = generateHash(password); // use the generateHash function in our user model
			
				var insertQuery = "INSERT INTO users ( email, password ) values ('" + newUserMysql.email +"','"+ newUserMysql.password +"')";
					console.log(insertQuery);
                    con.query(insertQuery,function(err,rows){
				newUserMysql.idusers = rows.insertId;
				
				return done(null, newUserMysql);
				});	
            }	
		});
        }))
}

generateHash = function (password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

validPassword = function (password, local_password){
    return bcrypt.compareSync(local_password, password);
}

module.exports = myLocalConfig;