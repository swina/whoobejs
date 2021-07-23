<template>
    <client-only>
        <blocks-block-preview v-if="article" :doc="article.blocks.json" :article="article"/>
    </client-only>
</template>

<script>
export default {
    name: 'WhoobeArticle',
    data:()=>({
        article: null,
        loaded: false,
        template: null
    }),
    head(){
        
        if ( this.article ){
            return {
                title: this.article.seo_title ? this.article.seo_title : this.article.title,
                meta: [
                    // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                    { 
                        hid: 'description', 
                        name: 'description', 
                        content: this.article.seo_description ? 
                            this.article.seo_description : 
                                this.article.title || '' 
                    }
                ]
            }
            
        }
       return 
        
        
    }, 
    async asyncData({app,route}){
        
        const articles = await app.$whoobe.service ( 'articles' ).find ( {
            query : {
                slug : route.params.slug
            }
        })
        return { 
            article : articles.data[0]
        }
    }
  /*
    apollo:{
        articles :{
            query : articleQuery,
            variables() {
                return { slug : this.$route.params.slug }
            },
            watchLoading(loading){
                this.loaded = loading
            },
            update : data => data.articles[0]
        }
    },

    /*
    async asyncData({app,route}){
        const data  = await app.apolloProvider.defaultClient.query({
            query : articleQuery,
            variables: {
                slug : route.params.slug 
            }
        })
        return {
            articles : data.data.articles[0]
        }
    }
    */
}
</script>