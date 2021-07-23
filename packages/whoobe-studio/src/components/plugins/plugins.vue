<template>
    <div class="m-2">
        <div class="flex flex-row">
            <button @click="createPlugin()">Add Plugin</button>
        </div>
        <div v-if="datastore.dataset.plugins && datastore.dataset.plugins.length" class="cursor-pointer bg-gray-100">
            <div class="hover:bg-gray-200 flex flex-col p-2 border-b" v-for="plugin in datastore.dataset.plugins" :key="plugin.general.name"  @click="pluginSettings(plugin)">
                <div class="" :class="plugin.general.enabled?'text-green-500 font-bold':'text-gray-500'">
                    {{ plugin.general.name }}
                </div>
                <div class="">
                    {{ plugin.general.description}}
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Plugins',
    computed: {
        ...mapState ( ['datastore','editor'] )
    },
    mounted(){
        this.$find('plugins')
    },
    methods:{
        createPlugin(){
            let newPlugin = Object.assign ( {} , this.datastore.schema.plugins )
            this.editor.current = newPlugin
            this.$action('plugin_settings')
            //console.log ( newPlugin )
        },
        pluginSettings(plugin){
            this.editor.current = plugin
            this.$action('plugin_settings')
        }
    }
}
</script>