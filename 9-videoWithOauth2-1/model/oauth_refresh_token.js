// Module dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OAuthRefreshTokensSchema = new Schema({
  refreshToken: String,
  clientId: String,
  userId: String,
  expires: Date
});

OAuthRefreshTokensSchema.statics.getRefreshToken = function(refreshToken, callback) {
  'use strict';

  console.log('calling getRefreshToken');

  OAuthRefreshTokensModel.findOne({refreshToken: refreshToken}, callback);
};

OAuthRefreshTokensSchema.statics.saveRefreshToken = function(token, clientId,
  expires, userId, callback) {
  'use strict';

  console.log('calling saveRefreshToken');

  var refreshToken = new OAuthRefreshTokensModel({
    refreshToken: token,
    clientId : clientId,
    userId : userId,
    expires: expires
  });

  refreshToken.save(callback);
};

mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema);
var OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens');

module.exports = OAuthRefreshTokensModel;
