// Initializes the `datastore` service on path `/datastore/:modelName`
const { Datastore } = require('./datastore.class');
const createModel = require('../../models/datastore.model');
const hooks = require('./datastore.hooks');
const path = require('path');
const neDB = require('nedb');

module.exports = function (app) {
  /*var options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };
  */
  
  /*const dbPath = app.get('nedb'); 
  console.log ( 'registered services => ' , Object.keys(app.services))
  app.service('collections').find().then ( result => {
    var _service
    if ( result.data.length ){
      result.data.forEach ( coll => {
        
          options.Model = new neDB( { filename: path.join( dbPath , coll.collection + '.db' ) })
          options.autoload = true
          options.timestampData = true
          app.use('/datastore/' + coll.collection , new Datastore ( options , app) )
          _service = app.service('datastore/' + coll.collection)
          _service.hooks(hooks)
        
      })
    } 
  }).then ( () =>{
  */  

    class DynamicService {
      

      find(params) {
        return this.getService(params.modelName).find(params);
      }
    
      get(id, params) {
        return this.getService(params.modelName).get(id, params);
      }
    
      create(data, params) {
        return this.getService(params.modelName).get(data, params);
      }
    
      update(id, data, params) {
        return this.getService(params.modelName).update(id, data, params);
      }
    
      patch(id, data, params) {
        return this.getService(params.modelName).patch(id, data, params);
      }
    
      remove(id, params) {
        return this.getService(params.modelName).remove(id, data, params);
      }
    
      setup(app) {
        this.app = app;
      }
    
      getService() {
        console.log ( '================================' , this.name  )
        const name = this.name
        const dbPath = app.get('nedb')
        if(!this.app.service('/datastore/' + name)) {
          //const modelSchema = modelSchemas.find(schema =>
          //  schema.modelName == name
          //);
          const options = {
            Model : new neDB( { filename: path.join( dbPath , name + '.db' ) }),
            autoload: true,
            timestampData : true
          }
    
          this.app.use(`datastore/${name}`, this.service({
              options,
              lean: true,
              paginate: {
                default: 10,
                max: 100
              }
          }));
          console.log ( this.app.service)
        }
    
        return this.app.service('datastore/' + name);
      }
    }
    
    app.use('/datastore/:modelName', new DynamicService() );
    //const service = app.service('datastore/:modelName');
    //service.hooks(hooks);

  //})

  // Get our initialized service so that we can register hooks

  // Get our initialized service so that we can register hooks

};
