const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('./../models/user')
const bcrypt = require('bcrypt')

module.exports = function(passport) {
    passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        User.findOne({ username: username }).then(user => {
            if(!user) {
                return done(null, false, { message: 'That username is not registered' })
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                if(isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'Password incorrect' })
                }
            })
        })
        .catch(err => console.log(err))
    })
)

passport.serializeUser(function(user, done) {
    done(null, user._id)
})

passport.deserializeUser(function(_id, done) {
    User.findById(_id, function(err, user) {
        done(err, user)
    })
})
}