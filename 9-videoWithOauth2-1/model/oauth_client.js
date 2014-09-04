// Module dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var authorizedClientIds = ['mobile', 'mobileReader'];

/**
 * OAuth Client Schema.
 *
 */
var OAuthClientsSchema = new Schema({
  clientId: String,
  clientSecret: String,
  redirectUri: String
});

OAuthClientsSchema.statics.getClient = function(clientId, clientSecret, callback) {
  'use strict';

  console.log('calling getClient');
  if(clientSecret === null) {
    return OAuthClientsModel.findOne({clientId: clientId}, callback);
  }
  OAuthClientsModel.findOne({
    clientId: clientId,
    clientSecret: clientSecret}, callback);
};

OAuthClientsSchema.statics.grantTypeAllowed = function(clientId, grantType, callback) {
  'use strict';

  console.log('calling grantTypeAllowed');

  if(grantType === 'password') {
    return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
  }

  callback(false, true);
};

mongoose.model('OAuthClients', OAuthClientsSchema);
var OAuthClientsModel = mongoose.model('OAuthClients');

module.exports = OAuthClientsModel;
