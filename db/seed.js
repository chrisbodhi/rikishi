module.exports = function(db) {
  db.User.create({
    name: 'Alice',
    isAdmin: false
  }).then(function(userRes) {
    db.Survey.create({
      question: 'Which cat would you like on your couch?'
    }).then(function(questionRes) {
      db.Response.create({
        answer: 'That fat one.',
        SurveyId: questionRes.dataValues.id
      }).then(function(answerRes) {
        console.log('answerRes', answerRes);
        db.Result.create({
          UserId: userRes.id,
          ResponseId: answerRes.dataValues.id,
          SurveyId: answerRes.dataValues.SurveyId
        });
      });
    });
  });
};
