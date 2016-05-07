var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/index').User;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(function(user) {
        done(null, user);
      }).catch(function(err) {
        done(err);
      });
  });

  passport.use('local-strategy', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    User.findOne({where: {
      email: email
    }}).then(function(user) {
      if (user) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      }
      var newUser = User.build({
        email: email,
        password: User.generateHash(password)
      });

      newUser.save()
        .then(function(savedUser) {
          return done(null, savedUser);
        }).catch(function(err) {
          console.log('~~~ Error saving new user:', err);
          throw new Error(err);
        });

      return newUser; // todo: delete this -- in place just to shut off error
    }).catch(function(err) {
      return done(err);
    });
  }));
};
