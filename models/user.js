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
      // Generate a password hash
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },

      // Check if submitted password is valid
      validPassword: function(password) {
        // todo: make sure `this.local` works
        console.log('this.local', this.local);
        return bcrypt.compareSync(password, this.local.password);
      }
    }
  });

  return User;
};
