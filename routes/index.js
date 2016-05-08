module.exports = function(router, passport) {
  router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
  });

  router.get('/signup', function(req, res) {
    res.render('signup', {
      title: 'Sign Up',
      message: req.flash('signupMessage')
    });
  });

  router.post('/signup', passport.authenticate('local-strategy', {
    successRedirect: '/survey',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  router.get('/login', function(req, res) {
    res.render('login', {
      title: 'Login Page',
      message: req.flash('loginMessage')
    });
  });

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/survey',
    failureRedirect: '/login',
    failureFlash: true
  }));

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/nope', function(req, res) {
    res.render('index', { title: 'Nope Page' });
  });

  router.get('/survey', isLoggedIn, function(req, res) {
    res.render('survey', {
      user: req.user,
      message: req.flash('surveyMessage')
    });
  });

  return router;
};

// eslint-disable-next-line consistent-return
function isLoggedIn(req, res, next) {
  // Verify user is logged in & authenticated
  if (req.isAuthenticated()) {
    return next();
  }

  // Redirect to login page if not ok
  // todo: tack on destination query param for redirect after login
  res.redirect('/login');
}
