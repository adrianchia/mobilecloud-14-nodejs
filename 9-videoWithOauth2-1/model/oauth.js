// Module dependencies
// https://github.com/thomseddon/node-oauth2-server/blob/master/examples/mongodb/model.js
var OAuthClient = require('./oauth_client');
var OAuthUser = require('./oauth_user');
var OAuthAccessToken = require('./oauth_access_token');
var OAuthRefreshToken = require('./oauth_refresh_token');

// OAuth2 Server Callbacks
// Always Required
module.exports.getAccessToken = OAuthAccessToken.getAccessToken;
// Always Required
module.exports.getClient = OAuthClient.getClient;
//Always Required
module.exports.grantTypeAllowed = OAuthClient.grantTypeAllowed;
// Always Required
module.exports.saveAccessToken = OAuthAccessToken.saveAccessToken;
// Required for 'password' grant type
module.exports.getUser = OAuthUser.getUser;
// Required for 'refresh_token' grant type
module.exports.saveRefreshToken = OAuthRefreshToken.saveRefreshToken;
// Required for 'refresh_token' grant type
module.exports.getRefreshToken = OAuthRefreshToken.getRefreshToken;
