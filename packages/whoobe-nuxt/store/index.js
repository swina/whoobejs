export const strict = false
import whoobe from '../plugins/server.js'
import config from '../config.json'

export const state = () => ({
    categories: null,
    popup: false,
    plugins:null,
    shop: null,
    product_variations: null,
    seo_title: 'Whoobe',
    seo_description: 'A visual blocks builder to generate full static websites, ecommerce and landing pages'
})

export const mutations = {
    
    SET_PLUGINS ( state , plugins ){
        state.plugins = plugins
    },
    SET_PRODUCTS ( state , shop ){
        state.shop = shop
    },
    SET_VARIATIONS ( state , variations ){
        state.product_variations = variations
    },
    SET_CATEGORIES ( state , categories ){
        state.categories = categories
    },
    SET_SEO_TITLE ( state , seo ){
        state.seo_title = seo
    },
    SET_SEO_DESCRIPTION ( state , seo ){
        state.seo_description = seo
    }
}

export const actions = {
    async loadHome( { commit } ){
        
        const shop_products = await whoobe.service ( 'products' ).find( { query: { $limit: 200 , type: 'product' }})
        commit ( 'SET_PRODUCTS' , shop_products )

        const shop_variations = await whoobe.service ( 'products' ).find( { query: { $limit: 200 , type: 'variation' }})
        commit ( 'SET_VARIATIONS' , shop_variations )

        const plugins = await whoobe.service ( 'plugins' ).find ( )
        commit ( 'SET_PLUGINS' , plugins.data.filter ( plugin => plugin.general.enabled && plugin.general.global ) )

        const categories = await whoobe.service ( 'categories' ).find( { query : { $sort: { name: 1}}})
        commit ( 'SET_CATEGORIES' , categories.data )
        //const articles = await whoobe.service ( 'articles' ).find ( { query: { $limit: 200 } } )
        //commit ( 'SET_ARTICLES' , articles.data )
    },
    seo_title ( { commit } ,  seo ){
        commit ( 'SET_SEO_TITLE' , seo )
    },
    seo_description ( { commit } ,  seo ){
        commit ( 'SET_SEO_DESCRIPTION' , seo )
    }
}

