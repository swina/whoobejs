<template>
    <!-- <pre v-if="article">
        {{ article }}
        {{ template }}
    </pre> -->
    <block.preview v-if="template" :doc="template.json" :article="true"/>
</template>

<script>
import Articles from '../../../articles.json'
export default {
    name : 'WhoobePluginPages',
    data:()=>({
        article : null,
        template: null
    }),
    mounted(){
        if ( this.$route.params.slug ){
            let articles = Articles.pages
            this.article = articles.filter ( article => {
                return article.slug === this.$route.params.slug
            })[0]
            this.$store.dispatch ( 'article' , this.article )
            this.$store.dispatch ( 'meta' , { title: this.article.seo_title , description : this.article.seo_description } )
            this.template = Articles.template
        }
    }
}
</script>