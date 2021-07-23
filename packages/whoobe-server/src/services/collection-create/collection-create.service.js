// Initializes the `collection-create` service on path `/collection/set`
const { CollectionCreate } = require('./collection-create.class');
const { DynamicService } = require('./collection-dynamic.class');
const hooks = require('./collection-create.hooks');
const NeDB = require('nedb');
const path = require('path');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  }
  // Initialize our service with any options it requires
  
  app.use('/donotuse/:modelName', 
  function(req,res,next){
      const dbPath = app.get('nedb');
      const Model = new NeDB({
        filename: path.join( dbPath, req.params.modelName + '.db' ),
        autoload: true,
        timestampData: true
    });
    options.model = Model
    next();
    
  }, new CollectionCreate ( options.app ) )
  // Get our initialized service so that we can register hooks
  const service = app.service('donotuse/:modelName');
  service.hooks(hooks);
};
