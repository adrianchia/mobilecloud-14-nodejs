// Module dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * OAuth Access Token Schema
 */
var OAuthAccessTokensSchema = new Schema({
  accessToken: String,
  clientId: String,
  userId: String,
  expires: Date
});

OAuthAccessTokensSchema.statics.getAccessToken = function(bearerToken, callback) {
  'use strict';

  console.log('calling getAccessToken');
  OAuthAccessTokensModel.findOne({accessToken: bearerToken}, callback);
};

OAuthAccessTokensSchema.statics.saveAccessToken = function(token, clientId,
  expires, userId, callback) {
    'use strict';

    console.log('calling saveAccessToken');

    var accessToken = new OAuthAccessTokensModel({
      accessToken: token,
      clientId: clientId,
      userId: userId,
      expires: expires
    });

    accessToken.save(callback);
};

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens');

module.exports = OAuthAccessTokensModel;
