/** 
 * This hook dynamically switch to a collection based on the route dynamic param
 * !endpoint is /collection/<collection_name>
 * @context.params.route.modelName  String
 * In order to work correctly your end point has to be:
 * /collection/<collection_name>
 * 
 * if a collection has not been create with /collections endpoint throw an error (service not available)
 * */
const Datastore = require('nedb');
const path = require('path');
const fs = require('fs')


module.exports = (options = {}) => {
    return async context => {
        const dbPath = context.app.get('nedb');
        if ( context.data && context.data.db ){
            db = new Datastore( { filename: path.join( dbPath , context.data.db + '.db' ) });
            db.loadDatabase(function (err) {    
                if ( err ) return err
            });
            context.app.service('collection').options.Model = db
            return context
        }
        if ( context.params.query && context.params.query.db  ){
            db = new Datastore( { filename: path.join( dbPath , context.params.query.db + '.db' ) });
            db.loadDatabase(function (err) {    
                if ( err ) context.error = err
            });
            context.app.service('collection').options.Model = db
            return context 
        }
        return context 
        /*
        const dbPath = context.app.get('nedb'); 
        console.log ( path.join ( dbPath , context.params.route.modelName + '.db'  ) )
        //if ( fs.existsSync ( path.join ( dbPath , context.params.route.modelName  + '.db' ) ) ){
                if ( context.service.options.Model != context.params.route.modelName + '.db' ){
                    const dbPath = context.app.get('nedb');
                    const Model = new NeDB({
                        filename: path.join(dbPath, context.params.route.modelName + '.db'),
                        autoload: true,
                        timestampData: true
                    });
                    context.service.options.Model = Model
                }
                return context
            
        //} else {
        //    context.error = true
        //    context.data = 'API not available or wrong url. Please check the documentation'
        //    context.result = context.data            
        //    return context
        //}
        */
    };
  };
  