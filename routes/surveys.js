var React = require('react');
var ReactDOM = require('react-dom/server');

var components = require('../public/javascripts/components');
var SurveyComponent = React.createFactory(components.SurveyComponent);

var isAdmin = require('../modules/auth').isAdmin;
var isLoggedIn = require('../modules/auth').isLoggedIn;

module.exports = function(router) {
  router.get('/surveys', isLoggedIn, function(req, res) {
    res.render('survey', {
      message: req.flash('surveyMessage'),
      react: ReactDOM.renderToString(SurveyComponent({
        user: req.user.dataValues
      })),
      user: req.user
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
