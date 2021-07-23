// Initializes the `collection` service on path `/collection`
const { Collection } = require('./collection.class');
const createModel = require('../../models/collection.model');
const hooks = require('./collection.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };
  var service , _service
  // Initialize our service with any options it requires
  //console.log ( app.service('collections') )
  app.use ( '/collection' , new Collection (options , app ) )
  /*
  app.use('/collection/:modelName', 
  function ( req, res, next ){
    let opts = options
    opts.Model = createModel(app,req.params.modelName)
    app.use('/collection/' + req.params.modelName , new Collection(opts,app) )
    _service = app.service('/collection/' + req.params.modelName )
    _service.hooks ( hooks )
    console.log ( req.params.modelName , Object.keys ( app.services ) , _service  )
    next()
  }, new Collection ( options , app )) 
  if ( !_service ){
  */
    service = app.service('/collection')
    service.hooks ( hooks )
  //}
    
  //service.hooks(hooks);
  
  // Get our initialized service so that we can register hooks
  //const service = app.service('collection/:modelName');
  
  
};
