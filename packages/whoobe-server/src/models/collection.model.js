const NeDB = require('nedb');
const path = require('path');

module.exports = function (app,name='collection.db') {
  
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, name ),
    autoload: true,
    timestampData: true
  });

  return Model;
};
