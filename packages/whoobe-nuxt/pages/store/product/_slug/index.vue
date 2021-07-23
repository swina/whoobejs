<template>
<client-only>
    <blocks-block-preview v-if="template" :doc="template.blocks.json"/>
    
</client-only>    
</template>

<script>

export default {
    name: 'WhoobeStoreProductSlug',
    
    async asyncData( { app , route } ){
        const template = await app.$whoobe.service('articles')
            .find ( {
                query : { shop: true }
            })
        return {
            template: template.data[0]
        }
    },
}
</script>