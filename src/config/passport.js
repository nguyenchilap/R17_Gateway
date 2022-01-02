const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('localLogin', new LocalStrategy (function(username, password, done) {
    if (username && password) 
        return done(null, username);
    return done(null, false, { message: 'Incorrect username or password !!!' });
}))


module.exports = passport;