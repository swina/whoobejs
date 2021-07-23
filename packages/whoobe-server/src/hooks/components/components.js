// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if ( context.data ){
      const blocks = context.data.json
      if ( context.method === 'patch' ){
        context.app.service ( 'blocks' ).find ( { query:  { component: context.data._id , $limit: 100 } } ).then ( result => {
          result.data.forEach ( block => {
            context.app.service ( 'blocks' ).remove ( block._id ).then ( result => {
              console.log ( 'removed => ' , block._id )
            })
          })
          return result.data
        }).then ( () => {
          blocks.blocks.forEach ( block => {
            context.app.service ( 'blocks' ).create ( {
                component: context.data._id,
                blocks: block
            }).then ( result => {
              console.log ( 'Patched blocks => ' , result.total )
            })
          })  
        })
      }
      if ( context.method === 'create' ){
        blocks.blocks.forEach ( block => {
          context.app.service ( 'blocks' ).create ( {
              component: context.data._id,
              blocks: block
          })
        })
      }  
    }
    return context;
  };
};
