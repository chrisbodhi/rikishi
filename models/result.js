'use strict';
module.exports = function(sequelize, DataTypes) {
  var Result = sequelize.define('Result', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    classMethods: {
      getResults: function(surveyId, callback) {
        Result.findById(surveyId)
          .then(function(results) {
            callback(null, results);
          });
      },
      addResult: function(userId, respId, surveyId) {
        // todo: add verification that user has not already
        // entered a selection for this survey question
        Result.create({
          UserId: userId,
          ResponseId: respId,
          SurveyId: surveyId
        }).then(function(input) {
          console.log('\n\nAdded result:', input);
        }).catch(function(err) {
          console.log('Error in addResult', err);
        });
      }
    }
  });

  return Result;
};
