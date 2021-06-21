import Vue from 'vue'
import store from '../../public/store'

import vuestore from '../store/index.js'

import PluginWrapper from '../components/common/plugin.wrapper.vue'
Vue.component ( 'plugin-wrapper' , PluginWrapper )


function hasProp ( obj , prop ){
    return obj.hasOwnProperty ( prop ) && obj[prop]
}

const api_url = 'http://localhost:3030/'

export default {
    install: function (Vue) {
        Vue.prototype.$randomID = ( prefix = 'whoobe' ) => {
            return prefix + '-' + Math.random().toString(36).substr(2, 5)
        }
        Vue.prototype.$message = (msg) => {
            vuestore.dispatch('message',msg )
        }
        Vue.prototype.$hasProp = ( obj , prop) => {
            if ( !obj || !prop ) return null
            return hasProp ( obj , prop )
        }
        Vue.prototype.$clean = function ( str = '' ){
            if ( !str ) return ''
            str = str.replace(/\s\s+/g, ' ')
            return [...new Set(str.split(' '))].join(' ')
        }
        Vue.prototype.$trim = function ( str = '' ){
            if ( !str ) return ''
            return str.replace(/\s\s+/g, ' ')
        }
        Vue.prototype.$imageURL = ( image , mode ) => {
            if ( !image ) return ''
            let url = ''
            if ( hasProp( image , 'uri') ){
                return image.uri
            }
            if ( hasProp ( image , 'previewUrl' ) && image.previewUrl ){
                image.previewUrl.includes ( '//' )  ?
                    url = image.previewUrl :
                    url = ( window.localStorage.getItem('whoobe-cms') || import.meta.env.VITE_API_URL ) + image.previewUrl.substring(1) 
                return url 
            }
            if ( hasProp(image,'url') ){
                image.url.includes('data:image') ? url = image.url :
                    image.url.includes('//') ? 
                        url = image.url : 
                            url = ( window.localStorage.getItem('whoobe-cms') || import.meta.env.VITE_API_URL ) + image.url.substring(1) 
            } else {
                image.includes ( '//' ) ?
                    url = image :
                    url = ( window.localStorage.getItem('whoobe-cms') || import.meta.env.VITE_API_URL ) + image.substring(1) 
            }
            if ( mode === 'bg' ) return 'background-image:url ( ' + url + ');'
            return url
        }
        // Vue.prototype.$imagePreviewURL = ( image ) => {
        //     if ( !image ) return ''
        //     let url = ''
        //         image.previewUrl ? 
        //             image.previewUrl.includes('//') ? 
        //                 url = image.previewUrl : 
        //                     url = ( window.localStorage.getItem('whoobe-cms') || import.meta.env.VITE_API_URL ) + image.previewUrl.replace('/','') :
        //                         image.url.includes('//') ? url = image.url : 
        //                             url =  ( window.localStorage.getItem('whoobe-cms') || import.meta.env.VITE_API_URL ) + image.url.replace('/','') 
            
        //     return url
            
        // }

        Vue.prototype.$backgroundImage = ( image ) => {
            if ( !image ) return ''
            if ( !image ) return ''
            
            let url = ''
                image.previewUrl ? 
                    image.previewUrl.includes('//') ? 
                        url = image.previewUrl : 
                            url = ( window.localStorage.getItem('moka-strapiurl') || import.meta.env.VITE_API_URL ) + image.previewUrl.replace('/','') :
                                image.url.includes('//') ? url = image.url : 
                                    url =  ( window.localStorage.getItem('whoobe-cms') || import.meta.env.VITE_API_URL ) + image.url.replace('/','') 
            
            return 'background-image:url ( ' + url + ');'
        }

        Vue.prototype.$arrayGroup = function ( arr , key , summ = {} ){
            /**
             @arr = array of objects (required)
             @key = key to group (required)
             @summ = key to sum
             group array of objects on given key, sum on key , count for given key
             return object grouped
                keys = grouped keys
                values = values for the each grouped keys
                sums = sum of values of field x for each grouped keys
                counters = counter for each grouped key
             */
            if ( arr != 'undefined' ){
              let counter = 0
              let sums = []
              let counters = []
              let sum_field = summ
              let total = 0
              let grouped = arr.reduce((h, item) => Object.assign(h, { [item[key]]:( h[item[key]] || [] ).concat(item) }), {})
              let keys = Object.keys(grouped)
              if ( summ ){
                Object.values(grouped).map(item=>{
                  total = 0
                  counter = 0
                  item.map(i=>{
                    counter++
                    total += parseFloat(i[sum_field])
                  })
                  sums.push(total)
                  counters.push(counter)
                })
              }
              return {
                keys: Object.keys(grouped),
                values: Object.values(grouped),
                sums: sums,
                counters: counters
              }
            }
            return null
          }
    

        Vue.prototype.$cookie = function(cname){
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
                }
            }
            return ''
        }
    
        Vue.prototype.$setCookie = function(cname,days){
            let d = new Date()
            d.setTime(d.getTime() + (parseInt(days) * 24 * 60 * 60 * 1000))
            let expiration = 'expires=' + d.toUTCString()
            document.cookie = cname + '=gpdr;' + expiration + ';path=/'
        }

        Vue.prototype.$slugify = function ( text = '' ){
            return text.toLowerCase()
            .replace(/ /g,'-')
            .replace(/[^\w-]+/g,'') 
        }

        // Vue.prototype.$imageDataUrl = ( image ) => {
        //     async (image) => {
        //         let blob = await fetch(image).then(r => r.blob());
        //         let dataUrl = await new Promise(resolve => {
        //             let reader = new FileReader();
        //             reader.onload = () => resolve(reader.result);
        //             reader.readAsDataURL(blob);
        //         });
        //         return dataUrl
        //     }
        // }

        // Vue.prototype.$isFileType = ( mime ) => {
        //     if ( !mime ) return null
        //     if ( mime.includes ( 'image' ) && !mime.includes ( 'webm') && !mime.includes ( 'mp4' ) ){
        //         return 'image'
        //     }
        //     if ( mime.includes ( 'webm') || mime.includes ( 'mp4' ) ){
        //         return 'video'
        //     }
        //     if ( mime.includes ( 'application') ){
        //         return 'file'
        //     }
        // }


    }
}