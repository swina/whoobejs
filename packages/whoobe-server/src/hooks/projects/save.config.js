const path = require ( 'path' )
const fs = require('fs-extra')
const { fstat } = require('fs')

module.exports = (options = {}) => {
    return async context => {
        let config = "const config = " + JSON.stringify(context.data) + '\nexport default config'
        let purgeCSS = JSON.stringify(context.data.purge.join(','))
        let purge = "purge = [" + purgeCSS + "]" + '\nmodule.exports = { purge }'
        //console.log ( purge )
        fs.writeFileSync ( path.resolve(context.app.get('generator')) + '/config.js' , config )
        fs.writeFileSync ( path.resolve(context.app.get('vite')) + '/purge.js' , purge )
        fs.writeFileSync ( path.resolve(context.app.get('vite')) + '/config.js' , config )
        // if ( context.data.uploads ) {
        //     context.data.uploads.forEach ( (image,i) => {
        //     // fs.copy ( path.resolve( context.app.get('public') ) + image , path.resolve ( workspace , context.data.project ) + '/dist' + image ).then ( () => {
        //     //   context.app.service('generate').create ( { data: image + ' uploaded.\n'} )
        //     // })
        //         fs.copy ( path.resolve( context.app.get('public') ) + image , path.resolve ( context.app.get('vite')  ) + '/dist' + image ).then ( () => {
        //             context.app.service('generate').create ( { data: path.resolve ( context.app.get('vite') ) + '/dist' + image + ' uploaded.\n'} )
        //         })
        //         .catch(err => {
        //             context.app.service('generate').create ( { error: 'Upload error ' + image + '\n' } )
        //             console.error(err)
        //             errors++
        //         })  
        //     })
        // }
    }
}