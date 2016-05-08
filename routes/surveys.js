var express = require('express');
var router = express.Router();

// todo: move into local modules
// eslint-disable-next-line consistent-return
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  // Redirect to login page if not ok
  // todo: tack on destination query param for redirect after login
  res.redirect('/login');
}

// eslint-disable-next-line consistent-return
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }

  // Redirect to login page if not ok
  // todo: tack on destination query param for redirect after login
  res.redirect('/surveys');
}

router.get('/', isLoggedIn, function(req, res) {
  res.render('survey', {
    user: req.user,
    message: req.flash('surveyMessage')
  });
});

router.get('/add', isAdmin, function(req, res) {
  res.render('add-survey', {
    user: req.user,
    message: req.flash('surveyMessage')
  });
});

module.exports = router;
