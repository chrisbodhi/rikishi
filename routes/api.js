var _ = require('lodash');
var express = require('express');

var db = require('../models/index');
var isAdmin = require('../modules/auth').isAdmin;

var router = express.Router();

// ///////// Start of helper functions
function getNextSurveyId(userId) {
  var getSurveyId = _.flow(_.difference, _.sample);
  return db.Survey.findAll({
    attributes: ['id']
  }).then(function(surveys) {
    return _.map(surveys, function(s) {
      return s.dataValues.id;
    });
  }).then(function(allIds) {
    return db.Result.findAll({
      where: {UserId: userId},
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
    var answers = _.map(survey.responses, function(obj) {
      return {
        id: obj.dataValues.id,
        text: obj.dataValues.answer
      };
    });

    res.send({
      id: survey.id,
      question: survey.question,
      answers: answers
    });
  });
});

router.post('/results', function(req, res) {
  // todo: compare `userId` to `req.user.dataValues.id`
  // for user confirmation
  var userId = parseInt(req.body.userId, 10);
  var respId = parseInt(req.body.answerId, 10);
  var surveyId = parseInt(req.body.surveyId, 10);

  try {
    db.Result.addResult(userId, respId, surveyId, function(result) {
      console.log('Saved result', _.size(result));
      res.send('Successfully recorded result.');
      // req.flash('surveyMessage', 'Response saved!');
      // res.redirect('back');
    });
  } catch (err) {
    console.log('Err recording result', err);
    req.flash('surveyMessage', 'Error!');
    res.redirect('back');
  }
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
