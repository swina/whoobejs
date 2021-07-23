const fs = require ( 'fs' )

function deleteFile ( file_path ){
    fs.stat ( file_path , ( err ,stat ) => {
        if ( !err ){
            fs.unlink ( file_path , (err) =>{
                if ( err ) {
                    return err
                }
                return true
            })
        } else {
            console.log ( file_path , ' not found' )
        }
    } )
}
module.exports = (options = {}) => {
    return async context => {
        const rootFolder = context.app.get('public')
        const deleteMedia = deleteFile ( rootFolder + context.params.query.image.url.replace('null','/uploads') )
        const mediaFormats = context.params.query.image.formats
        if ( mediaFormats && Object.keys(mediaFormats) ){
            Object.keys(mediaFormats).map ( format => {
                console.log ( 'delete file => ' , mediaFormats[format].url )
                deleteFile ( rootFolder + mediaFormats[format].url.replace('null','/uploads') )
            })
        }
        context.result = 'Deleted image => ' + context.params.query.image 
        return context
    }
}