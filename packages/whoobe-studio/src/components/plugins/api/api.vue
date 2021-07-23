<template>
    <pre>{{ $attrs.plugin }}</pre>
</template>

<script>
export default {
    name: 'PluginApi',
    mounted(){
        if ( this.$attrs.plugin.component.config ){
            this.$http ( this.$attrs.plugin.component.config.products ).then ( res => {
                console.log ( res )
            })
        }
    }
}
</script>