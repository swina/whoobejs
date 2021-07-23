
const NeDB = require('nedb');
const path = require('path');

exports.DynamicService = class DynamicService {
    constructor (options) {
        this.options = options || {};
    }

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
  
    getService(name) {
        console.log ( 'new collection is ' , name )
      if(!this.app.service(name)) {
        const dbPath = app.get('nedb');
        const Model = new NeDB({
          filename: path.join(dbPath, name ),
          autoload: true,
          timestampData: true
        });
        this.app.use(`/${name}`, service({
            Model,
            paginate: {
              default: 10,
              max: 100
            }
        }));
      }
      
      return this.app.service(name);
    }
  }