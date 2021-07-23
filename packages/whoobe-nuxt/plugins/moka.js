import Vue from 'vue'
// import MokaModal from '@/components/modal'
// Vue.component('moka-modal',MokaModal)
// import MokaStore from '@/components/plugins/store/nuxpresso/custom'
// Vue.component('moka-store',MokaStore)
//import BlockPreview from '@/components/blocks/block.preview.vue'
//Vue.component('block-preview',BlockPreview)

//import BlockPreviewContainer from '@/components/blocks/block.preview.container.vue'
//Vue.component('block-preview-container',BlockPreviewContainer)

//import BlockElementComponent from '@/components/blocks/block.element.component.vue'
//Vue.component('block-element-component',BlockElementComponent)
var VueScrollTo = require('vue-scrollto');
Vue.use(VueScrollTo)

import Icon from '@/components/common/icon.vue'
Vue.component('icon',Icon)
import IconExtra from '@/components/common/IconExtra.vue'
Vue.component('icon-extra',IconExtra)
import Iconify from '@iconify/iconify';
Iconify.enableCache('all', false);

import feathers  from '@feathersjs/feathers' 
import socketio from '@feathersjs/socketio-client' 
import io from 'socket.io-client' 
const socket = io( process.env.baseURL,
  {
    transports: ['websocket']
  }
)
const whoobe = feathers()
  .configure(socketio(socket,{
    timeout:20000
}))

Vue.prototype.$api = whoobe


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
                    responsiveCss = css 
                    //let i = textSizes.indexOf ( css )
                    //let rvalue = i > 2 ? textSizes[i-2] : textSizes[i]
                    //responsiveCss += ' ' + rvalue + ' md:' + css 
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

function imageURL ( image ){
    if ( !image ) return false
    //return image.url
    if ( process.client ){
        let url = ''
        if ( image.hasOwnProperty('url') ){
            image.url.includes ('//') ?
                url = image.url :
                    process.env.mode === 'production' ?
                        url = image.url : 
                            url = process.env.baseURL + image.url.substring(1) 
        } else {
            image.includes ( '//' ) ?
                url = image :
                    process.env.mode==='production' ?
                        url = image :
                            url  = process.env.baseURL + image.substring(1)
        }
        // !image.hasOwnProperty('url') ?
        //     image.includes('//') ? 
        //         url = image : 
        //             url = process.env.baseURL + image :
        //                 image.url ? 
        //                     url = image.url
        //                    //!image.url.includes('//') : url= image.url ? 
        //                 // process.env.mode==='production' ?
        //                    // url = image.url : 
        //                         // url = process.env.baseURL + image.url : //.substring(1) :
        //                             // url = image.url : ''
        return url
    }
}


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
                    // let i = textSizes.indexOf ( css )
                    // let rvalue = i > 2 ? textSizes[i-2] : textSizes[i]
                    // responsiveCss += ' ' + rvalue + ' md:' + css 
                    responsiveCss += css
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
