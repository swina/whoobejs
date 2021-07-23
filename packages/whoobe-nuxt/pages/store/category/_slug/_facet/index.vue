<template>
    <blocks-block-preview v-if="template" :doc="template.blocks.json"/>
</template>

<script>
export default {
    name: 'WhoobeStoreSingle',
    head(){
        return {
            title: this.$store.state.seo_title + ' - ' + this.facet.name ,
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { 
                  hid: 'description',
                  name: 'description', 
                  content: this.$store.state.seo_description,
                }
            ]
        }
    },
    async asyncData( { app , route , store } ){
        const template = await app.$whoobe.service('articles')
            .find ( {
                query : { shop: true }
            })
        const facet = store.state.categories.filter ( fc => fc.slug === route.params.facet )[0]    
        return {
            template: template.data ? template.data[0] : null,
            facet: facet
        }
    },
}
</script>