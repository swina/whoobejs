//import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs-extra'
import whoobe  from './plugins/server.js'
console.log ( whoobe )
//dotenv.config()
//console.log ( env )
var config
//var linkFonts = process.env.FONT_FAMILIES
async function configuration (){
  const buildNuxt = await whoobe.service ( 'build-nuxt' ).find()
  var configure = buildNuxt.data[0].blocks
  configure.target = buildNuxt.data[0].target
  //const ws = path.resolve ( 'config.json' )
  //const config = require ( ws )
  const mode = true //config.local
  //linkFonts = configure.fonts.join('|')
  let configuration = {
    purge: configure.purge,
    uploads: configure.uploads,
    fonts: configure.fonts
  }
  
  configure.mode = true
  await fs.writeFileSync ( path.resolve ( __dirname ) + '/config.json' , JSON.stringify ( configuration ) )
  return configure 
}
//default dynamic routes used by nuxpresso
let dynamicRoutes = () => {

  //let url = config.mode ? process.env.API_URL : config.url 
  return new Promise( (resolve) => {
    whoobe.service('build-nuxt').find().then ( res => {
      
      let slugs = res.data[0].pagesToPublish
      return slugs
    }).then ( slugs => {
      whoobe.service('articles').find({ query: { $limit: 200, slug: { $in: slugs } }}).then ( response => { 
        let articles = response.data.map ( page => {
          return {
            route: '/' + page.slug,
            payload: page
          }
        })
        return articles
      }).then ( data => {
        if ( config.store ){
          whoobe.service('products').find({ query: { $limit: 200 }}).then ( response => { 
          //axios.get( url + 'products?$limit=200' ).then( response => {
            let products = response.data.map( product => {
              return {
                route: '/store/product/' + product.slug,
                payload: product
              }
            })
            //resolve ( products )
            //resolve ( data.concat(products) )
            return [ ...data , ...products ]
          }).then ( prods => {
            whoobe.service('categories').find ( { query: { $limit: 200 , type: 'product' } }).then ( response => {
              let categories = response.data.map ( category => {
                return {
                  route: '/store/category/' + category.slug,
                  payload: category
                }
              })
              resolve ( [ ...prods , ...categories ])
            })
          })
        } else {
          //resolve ([])
          resolve ( data )
        }
      })
    })
  })
}

export default async () => {
  config = await configuration()
  console.log ( 'Output dir is => ' , config.target )
  return {
    target: 'static',
    components: true,
    ssr: true,
    /*
    ** Headers of the page
    */
    env: {
      baseURL: process.env.NODE_ENV === 'development' ? process.env.API_URL : process.env.API_URL ,//config.url ,
      VERSION: "0.0.1",
      mode: process.env.NODE_ENV,
      landing: false,
      emailSender : process.env.FORM_SENDER,
      emailConfirm: process.env.FORM_CONFIRM,
      development : process.env.NODE_ENV === 'development' ? true : false
    },

    head: {
      title: process.env.npm_package_name || "",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "whoobe",
          name: "whoobe static site generator",
          content: process.env.npm_package_description || ""
        }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          //Used fonts
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family="  + ( process.env.NODE_ENV === 'development' ? process.env.FONT_FAMILIES : config.fonts.join('|') )
        },
        {  
          //Material Design Icons
          rel: "stylesheet" ,
          href: "https://fonts.googleapis.com/icon?family=Material+Icons"
        },
        // { 
        //   //Bootstrap Icons
        //   rel: "stylesheet" ,
        //   href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
        // }
        

      ]
    },
    /*
    ** Customize the progress-bar color
    */
    loadingIndicator: {
      color: '#c3c3c3',
      background: 'white',
      continuous: true
    },
    /*
    ** Global CSS
    */
    css: [
      "~/assets/css/tailwind.css"
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
      "~/plugins/utils.js" , 
      "~/plugins/moka.js" , 
      "~/plugins/feathers.js" , 
      { src: "~/plugins/animations.js" , ssr: false } , 
      { src: "~/plugins/gsap.js" , ssr: false },
      
    ],
      
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
      '@nuxtjs/tailwindcss',
      //'@nuxtjs/recaptcha',
      '@nuxtjs/google-analytics'
    ],
    tailwindcss: {
        exposeConfig: true

    },
    //components: true ,
    // recaptcha : {
    //   siteKey: process.env.RECAPTCHA,
    //   version: 3,
    //   size: 'invisible',
    //   hideBadge: true
    // },
    postcss: {
      plugins: {
        'postcss-import': {},
        tailwindcss: path.resolve(__dirname, './tailwind.config.js'),
        'postcss-nested': {}
      }
    },
    /*
    ** Nuxt.js modules
    */
    modules: [ 
      "@nuxtjs/tailwindcss",
      "@nuxtjs/axios",
      'vue-scrollto/nuxt',
      '@nuxt/image',
    ],
    axios: {
      baseUrl: process.env.API_URL 
    },
    googleAnalytics: {
      id: config.analytics || process.env.GOOGLE_ANALYTICS || 'UA-XXX-X'
    },
    /*
    ** Build and generate configuration
    */
    generate: {
      routes: dynamicRoutes, //add dynamic routes
      fallback: true,
      dir: config.target || path.resolve ( __dirname , './dist'  )
    },
    build: {
      /*
      ** You can extend webpack config here
      */
      srcDir: 'src',
      buildDir: config.target || process.env.DESTINATION_FOLDER || 'dist',
      extractCSS: true,
      
      // this is not required, output as one css file instead of one by page.
      optimization: {
        splitChunks: {
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.(css|vue)$/,
              chunks: 'all',
              enforce: true
            }
          }
        }
      },
      extend(config, ctx) {},
      transpile: [
        "gsap"
      ],
      babel: {
        plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
        presets({ isServer }) {
          return [  
            [
              require.resolve('@nuxt/babel-preset-app'),
              {
                buildTarget: isServer ? 'server' : 'client',
                corejs: { version: 3 },
                useBuiltIns: "entry"
              }
            ]
          ]
        }
      }
    }
  }
};
