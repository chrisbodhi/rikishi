'use strict';
module.exports = function(sequelize, DataTypes) {
  var Survey = sequelize.define('Survey', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    question: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Survey.hasMany(models.Response, { as: 'responses' });
        Survey.hasMany(models.Result, { as: 'results' });
      }
    }
  });
  return Survey;
};
