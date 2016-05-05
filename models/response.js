'use strict';
module.exports = function(sequelize, DataTypes) {
  var Response = sequelize.define('Response', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    answer: DataTypes.STRING
  }, {
    // underscoredAll: true,
    classMethods: {
      associate: function(models) {
        Response.hasMany(models.Result, { as: 'results' });
      }
    }
  });
  return Response;
};
