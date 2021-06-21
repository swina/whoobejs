import Vue from 'vue'
import Icon from '../components/common/icon.vue'
Vue.component('icon',Icon)
import SimpleSvg from 'vue-simple-svg'
Vue.component ( 'simple-svg' , SimpleSvg )

//import moment from 'moment'
const pixels = [ 1 , 4 , 8 , 12 , 16 , 20 , 24 , 32 , 40 , 48, 64 , 80 , 96 , 128 , 160 , 192 , 224 , 256 ]
const pixelsAttrs = {
    'p' : 'padding' ,
    'pt' : 'paddingTop' ,
    'pr' : 'paddingRight' ,
    'pb' : 'paddingBottom' ,
    'pl' : 'paddingLeft',
    m : 'margin',
    mt: 'marginTop',
    mr: 'marginRight',
    mb: 'marginBottom',
    ml: 'marginLeft' 
}
const textSizes = [ '','text-xs' , 'text-sm' , 'text-base' , 'text-lg' , 'text-xl' , 'text-2xl' , 'text-3xl' , 'text-4xl' , 'text-5xl' , 'text-6xl' , 'text-7xl' , 'text-8xl' , 'text-9xl' , 'text-10xl' , 'text-20xl']


function cssResponsive ( classe ){

    if ( typeof classe === 'object' ) classe = classe.css
    if ( !classe || typeof classe === 'undefined' )  return ''
    return classe
    let allCss = classe.split(' ')
    let responsiveCss = ''
    allCss.forEach ( css => {   
        if ( css.length > 2 ){
            let key = css.split('-')[0]
            let val = css.split('-')[1]
            if (  pixelsAttrs[key] ){
                if ( css != 'm-auto'){
                    let value = pixels.indexOf ( parseInt(css.split('-')[1])*4 )
                    let rval = value > 5 ? pixels[value-5]/4 : 1
                    responsiveCss += ' ' + key + '-' + parseInt(rval) + ' md:' + css
                } else {
                    responsiveCss += ' m-auto'
                }
            } else {
                if ( textSizes.indexOf ( css ) > -1 ){
                    let i = textSizes.indexOf ( css )
                    let rvalue = i > 2 ? textSizes[i-2] : textSizes[i]
                    responsiveCss += ' ' + rvalue + ' md:' + css 
                } else {
                    if ( css.indexOf('translate') > -1 ){
                        responsiveCss  += ' md:' + css
                    } else {
                        responsiveCss += ' ' + css
                    }
                }
                if ( css.indexOf ( 'z-') ){
                    responsiveCss += ' '
                }
            }
        }
    })
    return responsiveCss
}

function returnURL (){
    let url = import.meta.env.VITE_CLOUD ? import.meta.env.VITE_API_URL : import.meta.env.MODE === 'production' ?
            '' : import.meta.env.VITE_API_URL 
    return url
}

function imageURL ( image ){
    if ( !image ) return false
    //return image.url
    let url = ''
        !image.hasOwnProperty('url') ?
            image.includes('//') ? url = image : url = returnURL() + image.substring(1) :
                image.url.includes('//') ? 
                    url = image.url :
                        url = returnURL() + image.url.substring(1) 
    return url
}

export default {
    install: function (Vue) {
    Vue.prototype.$classe = ( css = '') => {
        if ( !css ) return 
        return css.hasOwnProperty('css') ? cssResponsive(css.css) + ' ' + cssResponsive(css.container) : cssResponsive(css)
    }

    Vue.prototype.$background = ( block ) => {
        if ( !block ) return

        return block.hasOwnProperty('image') ?
            imageURL(block.image) ? ' background-image:url(' + imageURL(block.image) + ');' : '' : ''
        
    }

    Vue.prototype.$imageURL = ( image ) => {
        if ( !image ) return false
        return imageURL ( image )
        //let url = ''
        //image.url.includes('http') ? url = image.url : 
        //    url = image.url //process.env.API_URL + image.url.replace('/','') 
        //return url
        
    }

    Vue.prototype.$stile = ( block )=> {
        if ( !block ) return 
        let stl = ''
        if ( block.hasOwnProperty('fontFamily') ){
            stl += 'font-family:"' + block.fontFamily + '"'
        }
        stl += block.hasOwnProperty('style') ? block.style : ''
        return stl
    }

    Vue.prototype.$isMokaElement = ( block ) => {
        return block && !block.hasOwnProperty('blocks') || block.hasOwnProperty('items') ? true : false
    }

    Vue.prototype.$isMokaContainer = ( block , doc ) => {
        return block && !block.hasOwnProperty('slider') && block.hasOwnProperty('blocks') && !block.hasOwnProperty('menu') && block.tag !='form' && !block.loop && !doc.hasOwnProperty('form') ? true : false
    }

    Vue.prototype.$cssResponsive = ( classe = '') => {
        if ( typeof classe === 'object' ) classe = classe.css
        if ( !classe || typeof classe === 'undefined' )  return ''
        return classe
        let allCss = classe.split(' ')
        let responsiveCss = ''
        allCss.forEach ( css => {   
            if ( css.length > 2 ){
                let key = css.split('-')[0]
                let val = css.split('-')[1]
                if (  pixelsAttrs[key] ){
                    if ( css != 'm-auto'){
                        let value = pixels.indexOf ( parseInt(css.split('-')[1])*4 )
                        let rval = value > 8 ? pixels[value-8]/4 : 1
                        responsiveCss += ' ' + key + '-' + parseInt(rval) + ' md:' + css
                    } else {
                        responsiveCss += ' m-auto'
                    }
                } else {
                    if ( textSizes.indexOf ( css ) > -1 ){
                        let i = textSizes.indexOf ( css )
                        let rvalue = i > 2 ? textSizes[i-2] : textSizes[i]
                        responsiveCss += ' ' + rvalue + ' md:' + css 
                    } else {
                        if ( css.indexOf('translate') > -1 ){
                            responsiveCss  += ' md:' + css
                        } else {
                            responsiveCss += ' ' + css
                        }
                    }
                    if ( css.indexOf ( 'z-') ){
                        responsiveCss += ' '
                    }
                }
            }
        })
        return responsiveCss
        
    }
}
}
