var convict = require('convict');

var conf = convict({
  host: { doc: 'The hostname or IP address.', format: String, default: '0.0.0.0', env: 'HOST' },
  port: { doc: 'The port to bind.', format: 'port', default: 8080, env: 'PORT' },
  database: {
    //client: { doc: 'The database client name.', format: ['mysql'], default: 'mysql', env: 'DB_CLIENT' },
    client: { doc: 'The database client name.', format: ['oracledb'], default: 'oracledb', env: 'DB_CLIENT' },
    host: { doc: 'The database host name or url.', format: String, default: 'atsp-vsb-dev-new.ccfgqfpa0vtz.us-west-2.rds.amazonaws.com', env: 'DB_HOSTNAME' },
    //username: { doc: 'The database username.', format: String, default: 'root', env: 'DB_USER' },
    username: { doc: 'The database username.', format: String, default: 'MTS_QD_INTERNAL', env: 'DB_USER' },
    //password: { doc: 'The database password.', format: String, default: 'password', env: 'DB_PASSWORD' },
    password: { doc: 'The database password.', format: String, default: 'atsp', env: 'DB_PASSWORD' },
    //schema: { doc: 'The database/schema name.', format: String, default: 'temp', env: 'DB_SCHEMA' },
    schema: { doc: 'The database/schema name.', format: String, default: 'ORCLNEW', env: 'DB_SCHEMA' },
    //username: { doc: 'The database username.', format: String, default: 'root', env: 'DB_USER' },
    username2: { doc: 'The database username.', format: String, default: 'vsb_dev', env: 'DB_USER2' },
    //password: { doc: 'The database password.', format: String, default: 'password', env: 'DB_PASSWORD' },
    password2: { doc: 'The database password.', format: String, default: 'atspadmin', env: 'DB_PASSWORD2' },
  },
  ip: {
    doc: "The IP address to bind",
    format: "ipaddress",
    default: "0.0.0.0",
    env: "IP_ADDRESS"
  },
  port: {
    doc: "The port to bind",
    format: "port",
    default: 8080,
    env: "PORT"
  },
  logLevel: {
    doc: "Application Log Level",
    format: String,
    default: "info",
    env: "LOG_LEVEL"
  },
  logDirectory: {
    doc: "Application Log Directory",
    format: String,
    default: __dirname,
    env: "LOG_DIRECTORY"
  },
  keycloakConfigPath: {
    doc: "Keycloak json config. Obtain the config from keycload *master* realm",
    format: String,
    default: __dirname + "/keycloak.json",
    env: "KEYCLOAK_CONFIG_PATH"
  },
  keycloakAdminUser: {
    doc: "Keycloak realm admin user name",
    format: String,
    default: 'admin',
    env: "KEYCLOAK_ADMIN_USER"
  },
  keycloakAdminPassword: {
    doc: "Keycloak realm admin user password",
    format: String,
    default: '412015!',
    env: "KEYCLOAK_ADMIN_PASSWORD"
  },
  applicationId: {
    doc: "Application id. Use this only if you want to allow requests with token issued to access this application(aud claim)",
    format: String,
    default: '',
    env: "APPLICATION_ID"
  }
});

var conf = convict({
  host: { doc: 'The hostname or IP address.', format: String, default: '0.0.0.0', env: 'HOST' },
  port: { doc: 'The port to bind.', format: 'port', default: 8080, env: 'PORT' },
  port2: { doc: 'The port to bind.', format: 'port', default: 1521, env: 'PORT2' },
  database: {
    //client: { doc: 'The database client name.', format: ['mysql'], default: 'mysql', env: 'DB_CLIENT' },
    client: { doc: 'The database client name.', format: ['oracledb'], default: 'oracledb', env: 'DB_CLIENT' },
    host: { doc: 'The database host name or url.', format: String, default: 'atsp-vsb-dev-new.ccfgqfpa0vtz.us-west-2.rds.amazonaws.com', env: 'DB_HOSTNAME' },
    //username: { doc: 'The database username.', format: String, default: 'root', env: 'DB_USER' },
    username: { doc: 'The database username.', format: String, default: 'MTS_QD_INTERNAL', env: 'DB_USER' },
    //password: { doc: 'The database password.', format: String, default: 'password', env: 'DB_PASSWORD' },
    password: { doc: 'The database password.', format: String, default: 'atsp', env: 'DB_PASSWORD' },
    //schema: { doc: 'The database/schema name.', format: String, default: 'temp', env: 'DB_SCHEMA' },
    schema: { doc: 'The database/schema name.', format: String, default: 'ORCLNEW', env: 'DB_SCHEMA' },
    //username: { doc: 'The database username.', format: String, default: 'root', env: 'DB_USER' },
    username2: { doc: 'The database username.', format: String, default: 'vsb_dev', env: 'DB_USER2' },
    //password: { doc: 'The database password.', format: String, default: 'password', env: 'DB_PASSWORD' },
    password2: { doc: 'The database password.', format: String, default: 'atspadmin', env: 'DB_PASSWORD2' },
  },
  ip: {
    doc: "The IP address to bind",
    format: "ipaddress",
    default: "0.0.0.0",
    env: "IP_ADDRESS"
  },
  port: {
    doc: "The port to bind",
    format: "port",
    default: 8080,
    env: "PORT"
  },
  logLevel: {
    doc: "Application Log Level",
    format: String,
    default: "info",
    env: "LOG_LEVEL"
  },
  logDirectory: {
    doc: "Application Log Directory",
    format: String,
    default: __dirname,
    env: "LOG_DIRECTORY"
  },
  keycloakConfigPath: {
    doc: "Keycloak json config. Obtain the config from keycload *master* realm",
    format: String,
    default: __dirname + "/keycloak.json",
    env: "KEYCLOAK_CONFIG_PATH"
  },
  keycloakAdminUser: {
    doc: "Keycloak realm admin user name",
    format: String,
    default: 'admin',
    env: "KEYCLOAK_ADMIN_USER"
  },
  keycloakAdminPassword: {
    doc: "Keycloak realm admin user password",
    format: String,
    default: '412015!',
    env: "KEYCLOAK_ADMIN_PASSWORD"
  },
  applicationId: {
    doc: "Application id. Use this only if you want to allow requests with token issued to access this application(aud claim)",
    format: String,
    default: '',
    env: "APPLICATION_ID"
  }
});

module.exports = conf;
