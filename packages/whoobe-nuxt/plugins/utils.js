    import Vue from 'vue'
    //import moment from 'moment'
    import {SimpleSVG} from 'vue-simple-svg'
    Vue.component('simple-svg', SimpleSVG)

    /*
    const baseURL = 'https://js.api.here.com/v3/3.1/'
    const src = 'mapsjs.bundle.js' //'mapsjs-core.js','mapsjs-service.js','mapsjs-ui.js','mapsjs-mapevents.js']
    const styles = 'mapsjs-ui.css'
    import icons from './icons'
    Vue.use(icons)
    */

    const tones = {
        extralight : 100 ,
        verylight : 200 ,
        mediumlight: 300 ,
        light: 400 ,
        normal: 500 ,
        mediumdark: 600 ,
        dark: 700 ,
        verydark: 800 ,
        extradark: 900 
    }

    function colorTones( suf = 'fg' , color , tone ){
        let pref = suf === 'fg' ? 'text' : 'bg'
        if ( color != 'transparent' && color != 'black' && color != 'white' ) {
            return pref + '-' + color + '-' + tones[tone]
        } else {
            return pref + '-' + color
        }
    }

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


    

    Vue.prototype.$clean = function ( str = '' ){
        return str.replace(/\s\s+/g, ' ')
    }

    Vue.prototype.$cleanImage = ( img ) => {
        return {
            id: img.id,
            name: img.name,
            url: img.url,
            width: img.width,
            height: img.height,
            size: img.size,
            ext: img.ext,
            alternative_text: img.alternative_text,
            caption: img.caption
        }
    }

    

    Vue.prototype.$layer = (element)=>{
            
        let classe = ''
        
        if ( element.css.length ){
            let cl = element.css.split(' ')
            cl.forEach ( z => {
                z.indexOf('z-') > -1 ? classe += z : null
            })
        }
        return classe
    }

    Vue.prototype.$widget = function ( widgets , id ){
        return id ? widgets.filter ( w => { return w.id === parseInt(id) })[0] : null
    }

    Vue.prototype.$hasTimer = function ( classe ){
        if ( !classe ) return false
        let a = classe.split(' ')
        let timer = false
        a.forEach ( c => {
            if ( c.indexOf ( 'nuxpresso-timer') > -1 ){
                console.log ( c )
                timer = c.split('-').length > 2 ? c.split('-')[2] : 1000
            }
        })
        return timer
    }

    Vue.prototype.$icons = function(){
        return icons.split(',')
    }

    Vue.prototype.$moment = function ( d= new Date , format = 'MM-DD-YYYY') {
        let D = {
            month: d.getMonth()+1,
            day : d.getDate(),
            year : d.getFullYear()
        }
        let keys = ['month','day','year']
        if ( format != 'MM-DD-YYYY' ){
            keys = ['da','month','year' ]
        }
        let returnDate = keys.map ( key => {
            return D[key]
        }).join('-')
        return returnDate
        //return moment ( d ).format ( 'MM-DD-YYYY')
    }

    Vue.prototype.$slugify = function ( text = '' ){
        return text.toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'') 
    }

    Vue.prototype.$twColor = function ( field ){
        let classe = ''
        if ( field ){
            classe += field.color ?
                field.tw_color : ''
            classe += field.css ? ' ' + field.css : ''
        }
        return classe
    }

    Vue.prototype.$colorClass = function ( pref = 'bg' , color , tone ){

        if ( color != 'transparent' && color != 'black' && color != 'white' ) {

            return pref + '-' + color + '-' + tones[tone]
        } else {
            return pref + '-' + color
        }

    }

    Vue.prototype.$colorize = function ( theme , element  ){
        return theme[element] ? colorTones ( element.split('_')[1] , theme[element].color , theme[element].density ) : ''
    }

    
    Vue.prototype.$nuxpColor = function ( pref = 'bg' , color , tone ){
        if ( color != 'transparent' && color != 'black' && color != 'white' ) {
            return pref + '-' + color + tone ? '-' + tone : ''
        } else {
            return pref + '-' + color
        }
    }

    

    Vue.prototype.$menuLink = function ( item ){
        if ( !item ) return null
        return item.article ?
            '/articles/' + item.article.slug :
                item.category ? '/categories/' + item.category.slug :
                    item.link_url ? item.link_url : false
    }

    Vue.prototype.$btnClass = function ( theme ){
        let classe = theme.buttons_fg ? ' ' + theme.buttons_fg.tw_color : ' '
            classe += theme.buttons_bg ? ' ' + theme.buttons_bg.tw_color : ' '
            classe += ' ' + theme.buttons_bg.css +  ' ' + theme.buttons_fg.css
            return classe
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

    /* used for vue-here-map */
    Vue.prototype.$loadMapScript = function ( ) { // eslint-disable-line no-param-reassign
        return new Promise(function (resolve, reject) {
            if (document.querySelector('script[src="' + baseURL + src + '"]')) {
                resolve();
                return;
            }

            const el = document.createElement('SCRIPT');

            el.src = baseURL + src;
            el.defer = true
            el.async = true;
            el.type = 'module';

            el.addEventListener('load', resolve);
            el.addEventListener('error', reject);
            el.addEventListener('abort', reject);

            document.head.appendChild(el);
            let hereMapStyle = document.createElement('LINK')
            let url = baseURL + styles
            hereMapStyle.setAttribute('href' , url )
            hereMapStyle.setAttribute( 'rel' , 'stylesheet' )
            hereMapStyle.setAttribute( 'type' , 'text/css' )
            document.head.appendChild(hereMapStyle)
        });
    };

    Vue.prototype.$randomID = () => {
        return 'nuxpresso-id-' + Math.random().toString(36).substr(2, 5)
    }

    Vue.prototype.$debounce = (callback, duration) => {
        var timer;
        return function(event) {
        clearTimeout(timer);
        timer = setTimeout(function(){
            callback(event);
        }, duration);
        };
    }

    Vue.prototype.$arrayGroup = function ( arr , key , summ = {} ){
        // @arr = array of objects (required)
        // @key = key to group (required)
        // @summ = key to sum
        // group array of objects on given key, sum on key , count for given key
        // return object grouped
        //    keys = grouped keys
        //    values = values for the each grouped keys
        //    sums = sum of values of field x for each grouped keys
        //    counters = counter for each grouped key
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

