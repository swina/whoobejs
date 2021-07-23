<template>
    <blocks-block-preview v-if="template" :doc="template.blocks.json"/>
</template>

<script>
export default {
    name: 'WhoobeStore',
    head(){
        return {
            title: this.template.seo_title,
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { 
                  hid: 'description',
                  name: 'description', 
                  content: this.template.seo_description ? this.template.seo_description : this.template.seo_title,
                }
            ]
        }
    },
    async asyncData( { app , route } ){
        const template = await app.$whoobe.service('articles')
            .find ( {
                query : { store: true }
            })
        return {
            template: template.data ? template.data[0] : null
        }
    },
}
</script>