const fs = require ( 'fs-extra' )
const path = require ( 'path') 

module.exports = (options = {}) => {
    return async context => {
        let files
        context.app.service('media').find ( { query: { $limit: 300 , provider: 'local'}}).then ( res => {
            console.log ( res )
            files = res.data
            const folder = context.app.get('public')
            files.forEach( file => {
                console.log ( path.resolve ( folder ) + file.url , path.resolve ( folder ) + file.url.replace('uploads/','uploads/temp/' ) )
                fs.copy ( path.resolve ( folder ) + file.url , path.resolve ( folder ) + file.url.replace('uploads/','uploads/temp/' ) , (err) => {
                    if ( err ) console.log ( err )
                })
            })
        })
        console.log ( context.result )
    }
}