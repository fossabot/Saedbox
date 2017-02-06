// config/passport.js

var LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt');

// load up the models (to access user model)
let models = require('../models');

module.exports = function(passport) {

    // ----------------------- passport session setup -----------------------    

    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        models.collections.user.findOne({where:{id:id}}).exec(function(err,user){
            done(err, user);
        });
    });

    // ----------------------- Local Login -----------------------

    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        models.collections.user.findOne({where:{email:email}}).exec(function(err,user){
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.message="Email not found.");

            // Check if the password is good
            bcrypt.compare(password, user.password, function(err, res) {
              if (!res) {
                return done(null, false, req.message="User password incorrect");
              }

              else {
                // The user password is correct so we log him in
                req.logIn(user, function(err) {
                  if (err)
                    return done(err);

                  return done(null, user);
                });
              }
            });
        });

    }));

};