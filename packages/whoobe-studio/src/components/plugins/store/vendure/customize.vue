<template>
    <div class="flex flex-col p-2 bg-gray-100 text-black">
        <div class="flex flex-row">
            <button @click="mode='general'" :class="mode==='general'?'bg-indigo-500 text-white':''">General</button>
            <button @click="mode='loop'" :class="mode==='loop'?'bg-indigo-500 text-white':''">Loop</button>
            <button @click="mode='single'" :class="mode==='single'?'bg-indigo-500 text-white':''">Single</button>
        </div>
        <div class="border p-1">
            <template  v-for="field in Object.keys(settings[mode])">
                
                <label class="capitalize">{{ field }}</label>
                <div v-if="!isObject(settings[mode][field])">
                    <input v-if="isText(settings[mode][field])" type="text" v-model="settings[mode][field]"/>
                    <input v-if="isBoolean(settings[mode][field])" type="checkbox" v-model="settings[mode][field]"/>
                    <input v-if="isNumber(settings[mode][field])" type="number" size="4" class="w-8"  v-model="settings[mode][field]"/>
                </div>
                <div v-else>
                    <template v-for="(obj,i) in settings[mode][field]">
                        <div v-if="isObject(obj)" class="w-full grid gap-2" :class="'grid-cols-' + Object.keys(settings[mode][field]).length">
                            <div v-for="f in Object.keys(obj)" class="flex flex-col">
                                <label v-if="i===0">{{ f }}</label>
                                <input v-if="isText(obj[f])" type="text" v-model="settings[mode][field][i][f]"/>
                                <input v-if="isBoolean(obj[f])" type="checkbox" v-model="settings[mode][field][i][f]"/>
                                <input v-if="isNumber(obj[f])" type="number" style="width:4rem" v-model="settings[mode][field][i][f]"/>
                            </div>
                        </div>
                    </template>
                    
                </div>
            </template>
        </div>
        <button class="m-auto" @click="save">Save</button>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'VendurePluginSettings',
    data:()=>({
        mode: 'general',
        settings: {
            general: {
                url: 'http://localhost:3000/shop-api',
                limit: 12,
                collections: true,
                collection: false,
                layout_plain: true,
                add_to_cart: 'snipcart',
                orders: false
            },
            
            loop: {
                cols: 4,
                box_css: '',
                fields : [
                    { field: 'name', css: '' , function: '' } ,
                    { field: 'assets', css: '' , function: '' } ,
                    { field: 'price' , css: '' , function: ''} 
                ],
                add_to_cart: false
            },
            single: {
                layout_cols: 2,
                fields: [
                    { field: 'assets', css: '' , col: 0, function: '' },
                    { field: 'name' , css: '' , col: 1 , function: '' },
                    { field: 'variants' , css: '' , col: 1 , function: '' },
                    { field: 'price' , css: '', col: 1, function:'' },
                    { field: 'description' , css: '' , col: -1 , function: ''}
                ]
            }
           

        }
    }),
    methods: {
        isText(field){
            return typeof field === 'string' ? true : false
        },
        isNumber(field){
            return typeof field === 'number' ? true : false
        },
        isObject(field){
            return typeof field === 'object' ? true : false
        },
        isBoolean(field){
            return typeof field === 'boolean' ? true : false
        },
        save(){
            let plugin = this.$mapState().editor.current.plugin
            plugin.component.settings = this.settings
        }
    },
    mounted(){
        this.settings = this.$mapState().editor.current.plugin.component.settings
    }
}
</script>