<template>
    <div class="grid grid-cols-4 gap-3 p-4" v-if="plugins">
        <template v-for="plugin in plugins">
             <div class="p-2 relative shadow-2xl cursor-pointer hover:bg-black rounded justify-end items-center flex flex-col" @click="addPlugin(plugin)" v-if="plugin.general.enabled && !plugin.general.global">
                <i v-if="!plugin.general.enabled && plugin.general.editor" class="material-icons text-xl bg-gray-300 p-2 rounded-full">settings_input_component</i>
                <i v-if="plugin.general.enabled" class="material-icons text-xl bg-indigo-500 p-2 rounded-full">settings_input_component</i>
                <div>{{ plugin.general.name }}</div>
                <!--<div class="text-xs text-center">{{ plugin.description.substring(0,20) }}</div>-->
            </div>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'MokaEditorPlugins',
    data:()=>({
        plugins: null
    }),
    computed:{
        ...mapState ( ['moka','editor','datastore'] )
    },
    mounted(){
        //this.$http.get ( 'plugins' ).then ( res => {
            this.$api.service('plugins').find().then ( response => {
                this.plugins = response.data
            })
            //this.plugins = this.datastore.dataset.plugins
        //})
    },
    methods:{
        addPlugin(plugin){
            let obj = {
                id : this.$randomID(),
                type: 'plugin',
                name: plugin.general.name,
                plugin: plugin,
                element: 'div',
                tag: 'plugin',
                css: '',
                style: '',
                icon: 'settings_input_component'
            }
            this.editor.current.blocks.push ( obj )
            this.$action()
        }
    }
    
}
</script>