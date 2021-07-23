const kill = require ( 'kill-port' )
// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
    return async context => {

        kill(3000, 'tcp')
            .then(console.log)
            .catch(console.log)
        
        return context
        //let result = context.result.data[0]
        //result.count = result.count+1
        /*
        if ( result.count > result.max ){
          context.data = null
          context.result = 'Sorry ! Your plan has reached max number of requests ' + result.max 
          context.error = 'Error! Your plan has reached max number of requests ' + result.max 
          return context 
        } else {
          context.app.service('apikeys').patch ( result.id , result )
        }*/
     
    };
  };