<template> 
    <pre></pre>
</template>

<script>
export default {
    name: 'WhoobeGeneratorArticles',
    mounted(){
        this.$api.service ( 'articles' ).find ( { query: {
            $limit: 50,
            publish: true
        }}).then ( res => {
            res.data.forEach ( article => {
                let resource = this.$projectResources ( article , 'blocks' )
                console.log ( resource )
                resource.component = resource.blocks
                this.$api.service ( 'resources' ).create ( { project : resource } ).then ( res => {
                     console.log ( res )
                })

            })
        })
    }
}
</script>