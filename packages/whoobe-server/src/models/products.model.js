const NeDB = require('nedb');
const path = require('path');

module.exports = function (app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'products.db'),
    autoload: true,
    timestampData: true
  });

  return Model;
};
