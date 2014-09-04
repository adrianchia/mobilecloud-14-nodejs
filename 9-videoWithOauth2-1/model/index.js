var mongoose = require('mongoose');

// Connect to local MongoDB instance to 'mobilecloud' database. The standard URI connection scheme
// is mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
mongoose.connect('mongodb://localhost/mobilecloud');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('disconnected', function() {
  console.log('MongoDB disconnected');
});
db.once('open', function callback () {
  console.log('connected to MongoDB');
});

module.exports.oauth = require('./oauth');
module.exports.User = require('./oauth_user');
module.exports.OAuthClient = require('./oauth_client');
module.exports.Video = require('./video');

/**
 * For Testing purpose only, you shouldn't use this in a production app!
 */
module.exports.dropDB = function() {
  console.warn('Dropping database...');
  db.db.dropDatabase();
};
