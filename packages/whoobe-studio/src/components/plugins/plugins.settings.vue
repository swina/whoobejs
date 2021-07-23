<template>
    <div v-if="current && enabled" class="m-2 p-2 bg-gray-100 text-gray-700">
        <template v-for="(field,index) in Object.keys(datastore.schema.plugins)">
                    
            <details v-if="current.hasOwnProperty(field)">
                <summary  class="p-1 mt-1 text-lime-600 text-lg outline-none border-0 focus:outline-none cursor-pointer  capitalize font-bold" @click="summary=field">{{ field }}</summary>
                <div v-if="summary.includes(field)" class="grid grid-cols-2">
                    <template v-for="f in Object.keys(current[field])">
                        
                        <div v-if="current[field].hasOwnProperty(f) && typeof current[field][f] === 'object'" class="p-2 bg-gray-200">
                            
                            <details> 
                                <summary class="outline-none border-0 focus:outline-none cursor-pointer  capitalize font-bold" @click="summary=field+f">{{ f }}</summary>
                                <div  v-if="summary===(field+f)">
                                    <template v-for="ff in Object.keys(current[field][f])">
                                        <div v-if="current[field][f].hasOwnProperty(ff)" :key="field+f+ff">
                                            <label>{{ ff }}</label>
                                            <input type="text" v-if="typeof current[field][f][ff]==='string' && ff != 'config'" class="w-full" v-model="current[field][f][ff]"/>
                                            <input type="number" v-if="typeof current[field][f][ff]==='number' && ff != 'config'" class="w-full" v-model="current[field][f][ff]"/>
                                            <input class="float-left" type="checkbox" v-if="typeof current[field][f][ff]==='boolean'" v-model="current[field][f][ff]">
                                        </div>
                                    </template>
                                    <div class="p-1 bg-white border">
                                        Key <input type="text" v-model="new_key"/>
                                        Value <input type="text" v-model="new_key_value"/>
                                        <button class="sm" @click="addKey(field,f)">Add key</button>
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="p-1 bg-white border">
                                        Key <input type="text" v-model="new_key"/>
                                        Value <input type="text" v-model="new_key_value"/>
                                        <button class="sm" @click="addKey(current[field][f])">Add key</button>
                                    </div>
                                </div>
                            </details>
                            
                        </div>
                        <div v-else class="p-2">
                        
                            <label class="capitalize">{{ f }}</label>
                            <input type="text" v-if="typeof current[field][f]==='string' && f != 'config'" class="w-full" v-model="current[field][f]"/>
                            <input class="float-left" type="checkbox" v-if="typeof current[field][f]==='boolean'" v-model="current[field][f]">
                            <div v-if="typeof current[field][f] === 'object'">
                                {{ current[field][f] }}
                            </div>
                            <textarea class="w-full" v-if="f==='config'" v-model="current[field][f]"></textarea>
                            
                        </div>

                    </template>
                </div>
            </details>
            
        </template>
        <div class="flex flex-col w-full items-center justify-center p-2">
            <button v-if="!current.hasOwnProperty('_id')" @click="createPlugin()">Add Plugin</button>
            <button v-else @click="savePlugin()">Save</button>
        </div>
    </div>
</template>

<script>
/*
class plugin {
    constructor ( general , component , editor ){
        this.general = {
            name : general.name,
        }
        this.component = {
            config: general.config,
            path: general.path
        },
        this.editor = {
            settings : settings
        }
    }
}
*/
import { mapState } from 'vuex'
export default {
    name: 'PluginConfigurator',
    data:()=>({
        summary: '',
        plugin : null,
        new_key: '',
        new_key_value: '',
        current:null
    }),
    computed: {
        ...mapState ( ['datastore'] ),
        enabled(){
            if ( typeof webpackHotUpdate === 'undefined') this.$message('This option is available only in development mode')
            return typeof webpackHotUpdate != 'undefined' ? true : false 
        }
    },
    
    methods:{
        addKey(attribute,field){
            this.current[attribute][field][this.new_key] = this.new_key_value
        },
        createPlugin(){
            this.$api.service ( 'plugins' ).create ( this.current ).then ( res => {
                console.log ( res )
                this.$message ( 'Plugin added' )
            })
        },
        savePlugin(){
            this.$api.service ( 'plugins' ).patch ( this.current._id , this.current ).then ( res => {
                this.$message ( 'Plugin saved' )
            })
        }
    },
    mounted(){
        this.current = this.$mapState().editor.current
    }
}
</script>