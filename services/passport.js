const passport = require('passport');
const User = require('../models/User');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create local strategy
const localLogin = new LocalStrategy({ usernameField:'email' }, (email, password, done) => {
    //Verify email and password and call done if its correct email and passwotd, otherwise false
    User.findOne({email: email})
    .then((user) => {
        if(!user){
            return done(null,false);
        }

        //compare passwrods
        user.comparePassword(password, function(err, isMatch){
            if(err) {return done(err)}
            if(!isMatch) {return done(null, false)}
            return done(null, user);
        })
    })
    .catch((err) => {
        return done(err);
    })
})


const options = {};
options.jwtFromRequest = ExtractJwt.fromHeader('authorization');
options.secretOrKey = config.secret;

const jwtLogin = new JwtStrategy(options, function(payload, done){
    User.findById(payload.sub)
    .then((user) => {
        if(user){
            return done(null, user)
        }
        return done(null, false);
    })
    .catch((err) => {
        done(err, false);
    })
})

passport.use(jwtLogin);
passport.use(localLogin);
