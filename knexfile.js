const config = require('./config');
// Update with your config settings.

module.exports = {
  client: config.get('database.client'),
  connection: {
    host: config.get('database.host'),
    user: config.get('database.username'),
    password: config.get('database.password'),
    database: config.get('database.schema'),
  },
  migrations: {
    tableName: 'knex_migrations',
  },
  seeds: {
    tableName: './seeds' },
};
