// Module dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * OAuth User Schema
 */
var OAuthUsersSchema = new Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  roles: {type: Array, default: []},
  email: { type: String, default: ''}
});

OAuthUsersSchema.statics.getUser = function(username, password, callback) {
  'use strict';

  console.log('calling getUser');

  OAuthUsersModel.findOne({username: username, password: password},
    function(err, user) {
      if(err) return callback(err);
      callback(null, user._id);
  });
};

mongoose.model('OAuthUsers', OAuthUsersSchema);
var OAuthUsersModel = mongoose.model('OAuthUsers');

module.exports = OAuthUsersModel;
