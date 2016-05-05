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
      addResponse: function(userId, selection) {
        // todo: add verification that user has not already
        // entered a selection for this survey question
        Response.create({
          UserId: userId,
          ResponseId: selection.id,
          SurveyId: selection.surveyId
        }).then(function(input) {
          console.log('input:', input);
        }).catch(function(err) {
          console.log('Error in addResponse', err);
        });
      }
    }
  });

  return Result;
};
