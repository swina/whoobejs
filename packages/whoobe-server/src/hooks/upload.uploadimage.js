const { contentSecurityPolicy } = require('helmet');
const fs = require ( 'fs' )
const sharp = require ( 'sharp' )
const path = require ( 'path' )
const axios = require ( 'axios' )
 
module.exports = (options = {}) => {
    return async context => {
        let imgPath = context.app.get('public') + '/uploads/'
            
        let thumbs = context.params.thumbs ? parseInt(context.params.thumbs) : 200
        let destination = context.data.folder ? 
            imgPath + context.data.folder + '/' : 
                imgPath
        let folder = context.data.folder ? '/uploads/' + context.data.folder + '/' : '/uploads/'
        let options = {
            quality: 80,
            alphaQuality: 100,
            nearLossless: false,
            smartSubsample: true
        }
        //upload file from URL
        if ( context.data.dataURL && context.data.name ){
            var regex = /^data:.+\/(.+);base64,(.*)$/;
            var matches = context.data.dataURL.match(regex);
            var ext = matches[1];
            var data = matches[2];
            var buffer = Buffer.from(data, 'base64');
            let imageName = context.data.name + '.webp'
            sharp(buffer).webp(options).toFile(destination + context.data.name + '.webp').then ( info => {
                let saveMedia = {
                    name: imageName,
                    caption: imageName,
                    alternativeText: imageName,
                    provider: 'local',
                    related: [],
                    width: info.width,
                    height: info.height,
                    size: info.size,
                    url: folder + imageName,
                    ext: 'webp', //imageName.substr(imageName.length - 4 ),
                    mime: 'image/' + info.format,
                    formats: null
                }
                console.log ( context.data )
                
                if ( !context.data.folder ){
                    context.app.service ( 'media' ).create ( saveMedia ).then ( result => {
                        context.data = result    
                        return context
                    })
                }
            }).catch ( error => {
                console.log ( error )
            })
        }
        if ( context.data.url && context.data.name ){
            let imageName = context.data.name + '.webp'
            const input = (await axios({ url: context.data.url , responseType: "arraybuffer" })).data;
            sharp(input).webp(options).toFile(destination + context.data.name + '.webp').then ( info => {
                let saveMedia = {
                    name: imageName,
                    caption: imageName,
                    alternativeText: imageName,
                    provider: 'local',
                    related: [],
                    width: info.width,
                    height: info.height,
                    size: info.size,
                    url: folder + imageName,
                    ext: 'webp', //imageName.substr(imageName.length - 4 ),
                    mime: 'image/' + info.format,
                    formats: null
                }
                console.log ( context.data )
                
                if ( !context.data.folder ){
                    context.app.service ( 'media' ).create ( saveMedia ).then ( result => {
                        context.data = result    
                        return context
                    })
                }
            })
        }
        //Upload file with post file
        if (context.params.file){
            const file = context.params.file;
            
            //const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
            //context.data = {uri: uri , id: context.params.imageName};
            
            //let folder = context.params.folder ? '/uploads/' + context.params.folder + '/' : '/uploads/'
            let imageName = file.originalname
            imageName = imageName.replace(/ /g,'_')
            imageName = imageName.split('.').slice(0, -1).join('.') + '.webp' 
            //imageName = imageName.split('.')
            //imageName[imageName.length-1] = ''
            //if ( !context.params.format ){
                sharp(file.buffer).webp(options).toFile(destination + imageName).then ( info => {
                    let saveMedia = {
                            name: imageName,
                            caption: imageName,
                            alternativeText: imageName,
                            provider: 'local',
                            related: [],
                            width: info.width,
                            height: info.height,
                            size: info.size,
                            url: folder + imageName,
                            ext: 'webp', //imageName.substr(imageName.length - 4 ),
                            mime: 'image/' + info.format,
                            formats: null
                    }
                    console.log ( context.data )
                    if ( !context.data.folder ){
                        context.app.service ( 'media' ).create ( saveMedia ).then ( result => {
                            context.data = result    
                            return context
                        })
                    }
                }).catch ( error => {
                    console.log ( error )
                })
                
            //}
            /*


            if ( file.mimetype.includes ( 'image') && !file.mimetype.includes('svg') && !file.mimetype.includes('webp') ){
                
            new Jimp.read ( file.buffer , ( err, img )=> {
                    var clone = img.clone()
                    let default_size = 'large_'
                    var formats = {}
                    if ( thumbs > 0 ){
                        
                        var small = img.clone().scale(.3).quality(70).write(destination + 'small_' + imageName , (what) => { console.log ( what )})
                        var medium = img.clone().scale(.7).quality(70).write(destination + 'medium_' + imageName ) 
                        var thumbnail = img.clone().cover(thumbs,thumbs).quality(70).write(destination + 'thumb_' + imageName )
                        var large = img.clone().write ( destination + 'large_' + imageName )
                        formats = { 
                            small: {
                                ext: imageName.substr(imageName.length - 4 ),
                                mime: file.mimetype,     
                                width: small.bitmap.width,
                                height: small.bitmap.height,
                                size: small.bitmap.data.length,
                                url: folder + 'small_' + imageName
                            },
                            medium: {
                                ext: imageName.substr(imageName.length - 4 ),
                                mime: file.mimetype,
                                width: medium.bitmap.width,
                                height: medium.bitmap.height,
                                size: medium.bitmap.data.length,
                                url: folder + 'medium_' + imageName
                            },
                            thumbnail: {
                                ext: imageName.substr(imageName.length - 4 ),
                                mime: file.mimetype,
                                width: thumbs,
                                height: thumbs,
                                size: thumbnail.bitmap.data.lentgh,
                                url: folder + 'thumbnail_' + imageName
                            }
                        }
                    } else {
                        var large = img.clone().write ( destination + imageName )
                        default_size = ''
                    }
                    let retImage = {
                        name: imageName,
                        caption: imageName,
                        alternativeText: imageName,
                        provider: 'local',
                        related: [],
                        width: clone.bitmap.width,
                        height: clone.bitmap.height,
                        size: file.size,
                        url: folder + default_size + imageName,
                        ext: imageName.substr(imageName.length - 4 ),
                        mime: file.mimetype,
                        formats: formats
                    }   
                    if ( context.params.folder != 'preview' ){
                        context.app.service ( 'media' ).create ( retImage ).then ( result => {
                            context.data = result        
                        })
                    } else {
                        context.data.url = retImage.url
                    }   
            })
            }
            else {
                let ext = file.mimetype.split('/')
                ext = ext[ext.length-1]
                let saveMedia = {
                        name: imageName,
                        caption: imageName,
                        alternativeText: imageName,
                        provider: 'local',
                        related: [],
                        width: file.width,
                        height: file.height,
                        size: file.size,
                        url: folder + imageName,
                        ext: ext, //imageName.substr(imageName.length - 4 ),
                        mime: file.mimetype,
                        formats: null
                }
                
                console.log ( imageName , file.mimetype , file.buffer )
                
                fs.writeFile( destination + imageName , file.buffer , (err) => {
                    if ( err ) console.log ( err )
                })
                
                context.app.service ( 'media' ).create ( saveMedia ).then ( result => {
                    context.data = result    
                    return context
                })
            }
            */
        } 
    };
};    
