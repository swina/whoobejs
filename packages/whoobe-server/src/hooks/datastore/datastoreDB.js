/** 
 * This hook dynamically switch to a collection based on the route dynamic param
 * !endpoint is /datastore/<collection_name>
 * @context.params.route.modelName  String
 * In order to work correctly your end point has to be:
 * /collection/<collection_name>
 * 
 * if a collection has not been create with /collections endpoint throw an error (service not available)
 * */
const Datastore = require('nedb');
const hooks = require ( '../../services/datastore/datastore.class')
const path = require('path');
const fs = require('fs')


module.exports = (options = {}) => {
    return async context => {
        
        const dbPath = context.app.get('nedb');
        //console.log ( context.params )
        var coll = context.params.route.modelName
        var services = Object.keys(context.app.services)
        if ( services.includes ( 'datastore/' + coll ) ){
            console.log ( 'service registered')
            console.log ( context.app.service ( 'datastore/' + coll)  )
            console.log ( context.app.service ( 'collections')  )
            return context
        }
        if ( context.params.route.modelName ){
            
            context.app.service('collections').find( { query : { collection : coll } } ).then ( res => {
                if ( res.data.length ){
                    console.log ( coll , services.includes(coll) )
                    if ( !services.includes ( coll ) ){
                        db = new Datastore( { filename: path.join( dbPath , coll + '.db' ) });
                        db.loadDatabase(function (err) {    
                            if ( err ) console.log ( err ) // return err
                        });
                        db.timestampData = true
                        const options = {
                            Model: db,
                            paginate: context.app.get('paginate')
                        }
                        context.app.use ( '/datastore/' + coll,  new Datastore ( db , context.app ) ) 
                        const service = context.app.service('datastore/' + coll)
                        console.log ( service )
                        //service.hooks(hooks)
                        console.log ( Object.keys ( context.app.services ) )
                        return context
                    } else {
                        console.log ( Object.keys ( context.app.services ) )
                        return context 
                    }
                } else {
                    console.log ( '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                    context.data = 'No records'
                    context.result = 'API endpoint doesn\'t exist'
                    context.error = 'Error'
                    return context   
                }
            })
        } else {
            context.result = 'API endpoint doesn\'t exist'
            context.error = 'Error'
            return context    
        }
    };
  };
  