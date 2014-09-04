var models = require('./model');

models.User.create(
  {username: 'coursera', password: 'changeit', roles: ['admin','user']},
  {username: 'student', password: 'changeit', roles: ['user']},
  function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('saved user');
      models.OAuthClient.create({
        clientId: 'mobile',
        clientSecret: 'test',
        redirectUrl: '/oauth/redirect'
      },function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('saved oauthclient');
          process.exit();
        }
      });
    }
  }
);
