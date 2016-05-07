var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/index').User;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findAll({
      where: { name: username }
    }).then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Wrong username.' });
      }
      console.log('we have user', user);
      // if (!user.validPassword(password)) {
      //   return done(null, false, { message: 'Wrong password.' });
      // }
      return done(null, user);
    })
    .catch(function(err) {
      return done(err);
    });
  }
));

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Login Page' });
});

router.get('/nope', function(req, res) {
  res.render('index', { title: 'Nope Page' });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/nope' })
);

module.exports = router;
