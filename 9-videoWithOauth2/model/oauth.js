// Module dependencies
// https://github.com/thomseddon/node-oauth2-server/blob/master/examples/mongodb/model.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema definitions
var OAuthAccessTokensSchema = new Schema({
  accessToken: String,
  clientId: String,
  userId: String,
  expires: Date
});

var OAuthRefreshTokensSchema = new Schema({
  refreshToken: String,
  clientId: String,
  userId: String,
  expires: Date
});

var OAuthClientsSchema = new Schema({
  clientId: String,
  clientSecret: String,
  redirectUri: String
});

var OAuthUsersSchema = new Schema({
  username: String,
  password: String,
  roles: {type: Array, default: []},
  email: { type: String, default: ''}
});

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema);
mongoose.model('OAuthClients', OAuthClientsSchema);
mongoose.model('OAuthUsers', OAuthUsersSchema);

var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens');
var OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens');
var OAuthClientsModel = mongoose.model('OAuthClients');
var OAuthUsersModel = mongoose.model('OAuthUsers');

module.exports.createUser = function(username, password, roles, callback) {
  var user = new OAuthUsersModel({
    username: username,
    password: password,
    roles: roles
  });
  user.save(callback);
}

// Callbacks
module.exports.getAccessToken = function(bearerToken, callback) {
  'use strict';

  console.log('calling getAccessToken');
  OAuthAccessTokensModel.findOne({accessToken: bearerToken}, callback);
};

module.exports.getClient = function(clientId, clientSecret, callback) {
  'use strict';

  console.log('calling getClient');
  if(clientSecret === null) {
    return OAuthClientsModel.findOne({clientId: clientId}, callback);
  }
  OAuthClientsModel.findOne({
    clientId: clientId,
    clientSecret: clientSecret}, callback);
};

var authorizedClientIds = ['mobile', 'mobileReader'];

module.exports.grantTypeAllowed = function(clientId, grantType, callback) {
  'use strict';

  console.log('calling grantTypeAllowed');

  if(grantType === 'password') {
    return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
  }

  callback(false, true);
};

module.exports.saveAccessToken = function(token, clientId,
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

// Required for 'password' grant type
module.exports.getUser = function(username, password, callback) {
  'use strict';

  console.log('calling getUser');

  OAuthUsersModel.findOne({username: username, password: password},
    function(err, user) {
      if(err) return callback(err);
      callback(null, user._id);
  });
};

// Required for 'refresh_token' grant type
module.exports.saveRefreshToken = function(token, clientId,
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

// Required for 'refresh_token' grant type
module.exports.getRefreshToken = function(refreshToken, callback) {
  'use strict';

  console.log('calling getRefreshToken');

  OAuthRefreshTokensModel.findOne({refreshToken: refreshToken}, callback);
}
