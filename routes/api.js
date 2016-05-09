var _ = require('lodash');
var express = require('express');

var db = require('../models/index');
var isAdmin = require('../modules/auth').isAdmin;

var router = express.Router();

// ///////// Start of helper functions
function getNextSurveyId(id) {
  var getSurveyId = _.flow(_.difference, _.sample);

  return db.Survey.findAll({
    attributes: ['id']
  }).then(function(surveys) {
    return _.map(surveys, function(s) {
      return s.dataValues.id;
    });
  }).then(function(allIds) {
    return db.Result.findAll({
      where: {UserId: id},
      attributes: ['SurveyId']
    }).then(function(results) {
      var answered = _.map(results, function(r) {
        return r.dataValues.SurveyId;
      });
      return getSurveyId(allIds, answered);
    });
  });
}

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

function parseResults(resultsArr) {
  return _.map(resultsArr, function(obj) {
    var question = obj.question;
    var counts = _.map(obj.responses, function(resp) {
      return {
        response: resp.answer,
        count: _.filter(obj.results, function(resu) {
          return resu.ResponseId === resp.id;
        }).length
      };
    });
    return {
      question: question,
      counts: counts
    };
  });
}

// ///////// End helper functions

// ///////// Start of routes

router.get('/surveys', isAdmin, function(req, res) {
  db.Survey.findAll({
    include: [
      { model: db.Response, as: 'responses'},
      { model: db.Result, as: 'results'}
    ]
  }).then(function(surveys) {
    var parsedResults = parseResults(surveys);
    res.send({
      surveyResults: parsedResults
    });
  });
});

router.post('/surveys', isAdmin, function(req, res, next) {
  var question = req.body.question;

  // Handles situation where there are fewer than 3 answers
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
    next();
  }).catch(function(err) {
    console.log('Problem saving question', err);
    res.send({message: 'Problem saving question.'});
  });
  req.flash('surveyMessage', 'Question recorded!');
  res.redirect('back');
});

router.get('/survey/:id', function(req, res) {
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

router.get('/result/:surveyId', function(req, res) {
  var surveyId = req.params.surveyId;

  db.Result.getResults(surveyId, function(err, count) {
    if (err) {
      res.send(err);
    } else {
      res.send({ count: count });
    }
  });
});

router.get('/user', function(req, res) {
  res.send({ user: req.user.dataValues });
});

router.get('/survey/user/:userId', function(req, res) {
  var userId = req.params.userId;

  getNextSurveyId(userId)
    .then(function(nextId) {
      res.send({ nextId: nextId });
    })
    .catch(function(err) {
      console.log('Error getting ID for next survey', err);
    });
});

module.exports = router;
