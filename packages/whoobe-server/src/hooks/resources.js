// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const jp = require ( 'jsonpath' )

var purgedCSS = []

function cssArray(arr){
  arr.forEach ( classe => {
    let generalCSS 
    if ( typeof classe === 'string' ){
      generalCSS = classe.split(' ')
    } else {
      generalCSS = Object.values ( classe ).join (' ').split(' ')
    }
    generalCSS.forEach ( css => {
      css.length ? 
        purgedCSS.push ( css ) : null
    })
  })
  return 
}

module.exports = (options = {}) => {
  return async context => {
    if ( context.data.project ){
      let json = context.data.project.json
      let classes = await jp.query ( json , '$..blocks..css')
      await cssArray ( classes )
      let plugins_css = await jp.query ( json , '$..plugin..settings..css')
      await cssArray ( plugins_css )
      let plugins_container = await jp.query ( json , '$..plugin..settings..container')
      await cssArray ( plugins_container )
      context.result = [...new Set(purgedCSS)]
      return context
      
    }
  };
};
