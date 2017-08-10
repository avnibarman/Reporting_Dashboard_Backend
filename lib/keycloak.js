const conf = require('../config');
const Boom = require('boom');
const axios = require('axios');
const queryString = require('querystring');
//Read Keycloak config from specified path. TODO Move keycloak to separate module
var KEYCLOAK = require(conf.get('keycloakConfigPath'));
//Keycloak admin credentials
var KEYCLOAK_ADMIN = {
  "username": conf.get('keycloakAdminUser'),
  "password": conf.get('keycloakAdminPassword'),
  "client_id": KEYCLOAK.resource
};
//Keycloak admin urls
var KEYCLOAK_ADMIN_URL = {
  "realms": "/realms/",
  "token_grant_path": "/protocol/openid-connect/grants/access",
  "client_id": KEYCLOAK.resource
};

var KEYCLOAK_ADMIN_AUTH_URL = KEYCLOAK["auth-server-url"] + KEYCLOAK_ADMIN_URL.realms + KEYCLOAK.realm + KEYCLOAK_ADMIN_URL.token_grant_path;
var KEYCLOAK_GET_REALMS_URL = KEYCLOAK["auth-server-url"] + "/admin/realms";

var realmsCache = [];
//Convert public key to PEM format. This is required for JWT verification
function base64toPem(base64) {
  return "-----BEGIN PUBLIC KEY-----\n" + base64 + "\n-----END PUBLIC KEY-----";
}

module.exports = {
  load: function() {
    //Admin Auth
    return axios.post(KEYCLOAK_ADMIN_AUTH_URL,
      queryString.stringify(KEYCLOAK_ADMIN), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        }
    }).then(function(response) {
      //Get users
      var admin_token = response.data.access_token.toString();
      return axios.get(KEYCLOAK_GET_REALMS_URL, {
        headers: {
          "Authorization": "Bearer " + admin_token,
          "Content-Type": "application / json"
        }
      }).then(function(response){
        //console.log("Realms loaded ", response);
        if (response.status == 200) {
          if (response.data) {
            response.data.forEach(function(realmData){
              var realm = {};
              realm.publicKey = realmData.publicKey;
              realm.realm = realmData.realm;
              realmsCache[realm.realm] = realm;
            })
            return new Promise(function(resolve) {
              resolve({"realms": realmsCache});
            });
          }
          return new Promise(function(resolve, reject) {
            reject("No realms loaded");
          });
        } else {
          return new Promise(function(resolve, reject) {
            reject("Unexpected response status from keycloak ", response.status);
          });
        }
      }).catch(function(err) {
        return new Promise(function(resolve, reject) {
          reject("Failed to initalize keycloak module ", err);
        });
      });
    })
  },
  publicKey: function(token, callback) {
    if (token.realm) {
      var key = base64toPem(realmsCache[token.realm].publicKey);
      if (key) {
        return callback(null, key);
      } else {
        return callback(Boom.unauthorized('Key not found'));
      }
    } else {
      return callback(Boom.badRequest('realm claim missing in token'));
    }
  },
  publicKeys: function() {
    return realmsCache;
  },
  serverUrl: function() {
    return KEYCLOAK["auth-server-url"];
  }
};
