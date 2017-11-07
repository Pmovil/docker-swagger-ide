var bodyParser = require('body-parser');
var OAuthServer = require('express-oauth-server');


module.exports = function(app) {

  app.oauth = new OAuthServer({
    requireClientAuthentication:{
      password: false
    },
    model: {
      getClient: function(clientId, clientSecret) {   
          return new Promise(function(resolve, reject) {
            if(clientId == 'test_client'){  
              resolve({
                id: clientId,
                grants: [
                  'password'
                ]
              });
            } else {
              reject();
            }
          });
      },
      getUser: function(username, password) {
        return new Promise(function(resolve, reject) {
          if(username == "admin@teste.com" && password == "password"){
            resolve({
              id: 1234
            });
          } else {
            reject();
          }
        });
      },
      saveToken: function(accessToken, client, user) {
        return new Promise(function(resolve, reject) {
          resolve({
              accessToken: accessToken.accessToken,
              accessTokenExpiresAt: accessToken.accessTokenExpiresAt,
              refreshToken: accessToken.refreshToken,
              refreshTokenExpiresAt: accessToken.refreshTokenExpiresAt,
              scope: accessToken.scope,
              client: client,
              user: user
          });
        });
      },
    }
  });
   
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use('/oauth/token', app.oauth.token());

};

