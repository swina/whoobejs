// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const fs = require ( 'fs-extra' )
const path = require ( 'path' )
const slash = require ( 'slash' )
//const app = require('../app')
//create workspace with a default project at startup (first run)
function firstRun ( ws ){
  //const ws = path.resolve ( app.get ( 'workspace' ))
  const source = path.resolve ( 'whoobe/workspace' )
  fs.ensureDir ( ws ).then ( () => {
    console.log ( 'Default Workspace created!')
    fs.copy ( source + '/default' , ws + '/default' )
  }).catch ( error => {
    console.log ( error )
  })
}   

//fs.ensureDir ( path.resolve ( '../../whoobe/workspace') ).then ( () => {
//  fs.copy ( path.resolve ( 'whoobe/workspace') + '/default' , path.resolve ( '../../whoobe/workspace') + '/default' )
//}).catch ( error => {
//  console.log ( error )
//}) 

module.exports = (options = {}) => {
  return async context => {
    const workspace = context.app.get ( 'workspace' )//path.resolve('../../whoobe/workspace' )
    firstRun ( workspace )
    
    //projects list
    if ( context.method === 'find' ){
      if ( !context.params.query.project ){
        var projects = fs.readdirSync ( path.resolve ( workspace ) )
        projects = projects.filter ( project => {
          return !fs.statSync(path.resolve( workspace , project )).isFile() 
        })
        context.result = projects
      } else {
        const project = require ( path.resolve ( workspace , context.params.query.project ) +  '/config/config.js' ) 
        if ( context.params.query.connect ){
          if ( context.params.query.project === 'default' ){
            context.app.set ( 'nedb' , '../data' )
            console.log ( context.app.get('nedb'))
            const services = require ( '../services' )
            context.app.configure ( services )
            
          } else {
            context.app.set ( 'nedb' , path.resolve ( workspace ,  context.params.query.project ) + '/data')
            console.log ( context.app.get('nedb') )
            const services = require ( '../services' )
            context.app.configure ( services )
          }
        }
        context.result = project
      }
    }
    
    //get single project info
    if ( context.method === 'get' ){
      const project = require ( path.resolve ( workspace , context.id ) +  '/config/config.js' ) 
      if ( context.id === 'default' ){
        context.app.set ( 'nedb' , '../data' )
        console.log ( context.app.get('nedb'))
        const services = require ( '../services' )
        context.app.configure ( services )
      } else {
        context.app.set ( 'nedb' , path.resolve ( workspace , context.id ) + '/data')
        console.log ( context.app.get('nedb'))
        const services = require ( '../services' )
        context.app.configure ( services )
      }
      context.result = project 
    }

    //create project 
    if ( context.method === 'create' ){
      fs.copy ( path.resolve ( 'whoobe/workspace') + '/default' , path.resolve ( '../../whoobe/workspace') + '/' + context.data.name ).then ( () => {
        context.result = 'Created project : ' + context.data.name
      })
    }

    //update project configuration 
    if ( context.method === 'patch' ){
      let project = context.data
      project.dist = slash ( workspace + '/' + project.name + '/' + project.dist )
      const configString = 'const whoobe={ \nname: "' + project.name + '",\nurl : "' + project.url + '" ,\ndist : "' + project.dist + '" ,\nfonts: "' + project.fonts + '" ,\nuploads: ' + project.uploads + '}\nmodule.exports = whoobe'
      const writeConfig = await fs.writeFileSync ( path.resolve ( workspace , project.name ) + '/config/config.js' , configString )
    }
    return context;
  };
};
