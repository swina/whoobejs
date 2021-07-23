/** 
 * Use this hook to create new collections.
 * New collections have to be validated passing the key params
 * 
 * @collection  String: collection name
 * @key         String: validation key (extendKey in config)
 * 
 * If validation key fail no collection and relative services are available
 * */
const NeDB = require('nedb');
const path = require('path');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if ( context.data.collection ){
      const key = context.app.get('extendKey')
      if ( context.data.collection && context.data.key === key ){
        const dbPath = context.app.get('nedb');
        const Model = new NeDB({
          filename: path.join( dbPath, context.data.collection + '.db' ),
          autoload: true,
          timestampData: true
        });
        return context;
      } else {
        context.data = 'Validation key is not valid. Service aborted.'
        context.error = true
        return context;
      }
    }
  };
};
