var express = require('express');
var router = express.Router();
var db = require('../models/index');

router.get('/surveys', function(req, res) {
  db.Survey.findAll()
    .then(function(surveys) {
      res.send({
        surveys: surveys
      });
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
