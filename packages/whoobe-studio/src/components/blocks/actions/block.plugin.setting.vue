<template>
    <div class="flex flex-col theme-dark p-4">
        <component :is="component" :component="component"/>
        <template v-if="!component" v-for="field in Object.keys($mapState().editor.current.plugin.component.settings)">
            <label class="capitalize">{{ field }}</label>
            <input type="text" v-model="$mapState().editor.current.plugin.component.settings[field]"/>
        </template>
        <!-- <pre class="text-black">{{ $mapState().editor.current.plugin.editor }}</pre> -->
    </div>
</template>

<script>
export default {
    name: 'BlockPluginSetting',
    computed:{
        component(){
            if ( this.$mapState().editor.current.plugin.component.config.hasOwnProperty('settings') ){
                console.log ( this.$mapState().editor.current.plugin.component.config.settings )
                return () => import ( '@/components/plugins/' + this.$mapState().editor.current.plugin.component.config.settings )
            } else {
                return false
            }
        }
    },
    mounted(){
        console.log ( this.$mapState().editor.current.plugin.component.settings )
    }
}
</script>