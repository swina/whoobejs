const knex = require('knex');

module.exports = function (app) {
  const { client, connection } = app.get('mysql');
  const db = knex({ client, connection });

  app.set('knexClient', db);
};
