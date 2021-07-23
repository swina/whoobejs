<template>
    <div>
        <!--<nuxpresso-moka-template v-if="loop_template" :template="loop_template.json" :article="articlesList" :pagination="true" :start="start" :limit="limit"/>-->
        <h1>COMPONENT</h1>
        
    </div>
</template>

<script>
//import articlesPaginationQueries from '@/apollo/queries/article/articles-by-category'
//import categoryQuery from '@/apollo/queries/category/categories-slug'
//import componentTemplateQuery from '@/apollo/queries/component/component.loop'
//import NuxpressoMokaTemplate from '@/components/mokastudio/moka.preview'
import { mapState } from 'vuex'

export default {
    name: 'NuxpCategories',
    data:()=>({
        start: 0,
        limit: 4,
        component:null,
        articles: []
    }),
    //components: { NuxpressoMokaTemplate },
    computed:{
        ...mapState ( ['settings','loop_action','categories','loop_articles','loop_template'] ),
        action(){
            return this.loop_action
        },
        setLimit(){
            if ( this.component.hasOwnProperty('loop_limit') ){
                this.limit = parseInt(this.component.loop_limit)
            }
        },
        articlesList(){
            if ( this.loop_articles ){
                let arts = []
                this.loop_articles.map ( article => {
                    if ( article.categories[0].slug === this.$route.params.slug ){
                        arts.push ( article )
                    }
                })
                this.articles = arts
                
                if ( arts ){
                //console.log ( this.$arrayGroup( this.articles , 'categories.slug', 'id') )
                    let lista = []
                    this.articles.map ( (article,index) => {
                        if ( index >= this.start && index < (this.start+this.limit) ){
                            lista.push ( article )
                        }
                    })
                    return lista
                }
                return false
            }
        },
        category(){
            return this.categories.filter ( cat => { cat.slug === this.$route.params.slug })[0]
        }
    },
    mounted(){
        /*
        let articles
            this.component.autosave ?
                articles = this.component.autosave.articles : null

                articles.forEach ( article => {
                    if ( article.categories ){
                        let found = false
                        article.categories.forEach ( cat => {
                            if ( cat.slug === this.$route.params.slug ){
                                if ( !article.homepage ){
                                    found = true
                                    
                                }
                            }
                        })
                        found ? this.articles.push ( article ) : null
                    }
                })
            */
    },
    head(){
        return {
            title: this.settings.site_name + ' - ' + this.$route.params.slug,
            meta: [
                { 
                hid: this.$route.params.slug, 
                name: this.$route.params.slug, 
                content: this.settings.site_title + ' ' +  this.$route.params.slug }
            ]
        }
    },
    watch:{
        action(v){
            if ( v === 'next' ){
                (this.start + this.limit) < this.articles.length ?
                     this.start += this.limit
                        : null
                //this.$fetch()
                this.$store.dispatch ( 'set_loop_action' , null )
            } 
            if ( v === 'prev'){
                this.start -= this.limit
                if ( this.start < 0 ) this.start = 0
                //this.$fetch()
                this.$store.dispatch ( 'set_loop_action' , null )
            }
        }
    },
    /*
    async asyncData({app,route,payload,params,error,store}){
        
        if ( payload ){
            console.log ( Object.keys(store.state) )
            return {
                articles: payload,
                component: store.state.default_component
            }
        } else {
            const articlesQry  = await app.apolloProvider.defaultClient.query({
                query : articlesPaginationQueries,
                variables: {
                    //start: this.start,
                    //limit: this.limit,
                    slug: route.params.slug
                }
            })

            const componentsQry  = await app.apolloProvider.defaultClient.query({
                query : componentTemplateQuery,
            })
            
            return {
                component : componentsQry.data.components[0],
                articles: articlesQry.data.articles
            }
        }
    },
    */
    /*
    async fetch(){
        //this.$nuxt.$loading.start()
        //this.$apolloProvider.defaultClient.query({
        //    query: componentTemplateQuery,
        //    variables:{
        //        loop_type : this.$route.params.slug
        //    }
        //}).then ( resp => {

            //console.log ( resp )
            //if ( !resp.data.length ){
                this.$apolloProvider.defaultClient.query({
                    query: componentTemplateQuery
                }).then ( response => {
                    console.log ( response.data )
                    this.component = response.data.components[0]
                })
            //} else {
            //    this.component = resp.data.components[0]
            //}
            
            this.$apolloProvider.defaultClient.query({
            query: articlesPaginationQueries,
            variables: {
                //start: this.start,
                //limit: this.limit,
                slug: this.$route.params.slug
            }
            }).then ( resp => {
                this.articles = resp.data.articles//.filter ( article => {
                    //return article.categories.name = this.$route.params.slug
                //})
                //this.$nuxt.$loading.finish() 
            })
        //})
        
    },
    mounted(){
        
        this.$fetch()
    }
    */
}
</script>