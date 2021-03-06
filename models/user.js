'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Result, { as: 'results' });
      },
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });

  return User;
};
