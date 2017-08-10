'use strict';
//import Knex from './knex';

const conf = require('./config');
const Hapi = require('hapi');
const Knex = require('knex');
const _ = require('lodash');
const Boom = require('boom');
//Load keycloak module
const keycloak = require('./lib/keycloak.js');

// Server config
const serverOptions = {
  host: 'localhost',
  port: conf.get('port')
}

const server = new Hapi.Server();
server.connection(serverOptions);

server.register(require('hapi-auth-jwt2'), function(err){
  if (err) {
    console.log(err);
  }

  server.auth.strategy('jwt', 'jwt', {
    key: keycloak.publicKey,
    validateFunc: validate,
    cookieKey: 'token',
    urlKey: 'token',
    verifyOptions: {
      algorithms: [ 'RS256' ]    // specify your secure algorithm
    }
  });
});

server.route(require('./server/routes')());

//Start server only when keycloak load is successful
keycloak.load().then(function(){
  server.start(() => {
      console.log('Server running at:', server.info.uri);
  });
}).catch(function(err){
  console.log(err);
  process.exit(1);
})

// JWT Token Verification and obtaining user object
function validate(decoded, request, callback) {
  //Validate issuer
  if (!_.startsWith(decoded.iss, keycloak.serverUrl())) {
    return callback("Uknown/Untrusted ISS", false, null);
  }
  //Validate audience, if defined
  if (decoded.aud
    && conf.get("applicationId")
    && decoded.aud != conf.get("applicationId")) {
    return callback("Token not intended for this application", false, null);
  }
  //Create user and set role into scope
  var user = {};
  user.email = decoded.email;
  user.scope = decoded.roles.split(",");
  user.accountId = decoded.accId;
  user.id = decoded.sub;
  return callback(null, true, user);
};
