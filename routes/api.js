var express = require('express');
var router = express.Router();
var db = require('../models/index');
var _ = require('lodash');

// Start of helper functions
function insertResponse(res, questionId, answerString) {
  db.Response.create({
    answer: answerString,
    SurveyId: questionId
  }).then(function(newAnswer) {
    console.log('Added answer', newAnswer.dataValues);
  }).catch(function(err) {
    console.log('Problem saving response', err);
    res.send({message: 'Problem saving answer ' + answerString});
  });
}

// eslint-disable-next-line consistent-return
function isAdmin(req, res, next) {
  // Verify user is logged in & authenticated
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }

  // Redirect to login page if not ok
  // todo: tack on destination query param for redirect after login
  res.redirect('/login');
}

// End helper functions

// Start of routes

router.get('/surveys', function(req, res) {
  db.Survey.findAll()
    .then(function(surveys) {
      res.send({
        surveys: surveys
      });
    });
});

router.post('/survey', isAdmin, function(req, res) {
  var question = req.body.question;
  var answers = _.compact([
    req.body.answer1,
    req.body.answer2,
    req.body.answer3
  ]);
  db.Survey.create({
    question: question
  }).then(function(newQuestion) {
    var questionId = newQuestion.id;
    _.forEach(answers, function(answer) {
      insertResponse(res, questionId, answer);
    });
    res.send({
      message: 'Added survey #' + questionId + ' successfully!'
    });
  }).catch(function(err) {
    console.log('Problem saving question', err);
    res.send({message: 'Problem saving question.'});
  });
});

router.get('/surveys/:id', function(req, res) {
  db.Survey.find({
    where: { id: req.params.id },
    include: [{ model: db.Response, as: 'responses'}]
  }).then(function(survey) {
    var answers = survey.responses.map(function(obj) {
      return obj.dataValues.answer;
    });
    res.send({
      question: survey.question,
      answers: answers
    });
  });
});

router.post('/results', function(req, res) {
  var userId = req.user.id;           // todo: yeah right
  var selection = req.body.response;  // todo: see above note
  db.Result.addResponse(userId, selection, function(err, resp) {
    if (err) {
      res.send(err);
    } else {
      res.send(resp);
    }
  });
});

router.get('/results/:surveyId', function(req, res) {
  var surveyId = req.params.surveyId;

  db.Result.getResults(surveyId, function(err, count) {
    if (err) {
      res.send(err);
    } else {
      res.send({ count: count });
    }
  });
});

module.exports = router;
