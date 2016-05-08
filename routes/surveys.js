var isAdmin = require('../modules/auth').isAdmin;
var isLoggedIn = require('../modules/auth').isLoggedIn;

module.exports = function(router) {
  router.get('/surveys', isLoggedIn, function(req, res) {
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

  return router;
};
