<template>
<div class="m-1 p-2 theme-dark relative">
    <div class="flex w-full items-center flex-row justify-start text-lg">
    <button class="text-lg py-2" @click="edit=false,loopEditor=false,categories=false">Products</button>    
    <button class="text-lg py-2" v-if="!edit" @click="categories=!categories">Categories</button>
    <button class="text-lg py-2" v-if="!edit" @click="productCreate()">Create </button>
    <button class="text-lg py-2" v-if="edit && editor.current" @click="productSave()">&raquo; {{ editor.current.name }}</button>
    <button class="text-lg py-2" v-if="!edit" @click="importFile=!importFile">Import</button>
    <button class="text-lg py-2" v-if="!edit" @click="exportFile=!exportFile">Export</button>
    <button class="text-lg py-2" v-if="!edit" @click="loopEditor=!loopEditor" :class="loopEditor?'bg-white text-black':''">Loop Editor</button>
    <input v-if="!edit" type="text" class="bg-transparent text-lg ml-2" placeholder="search" v-model="search" @keydown="productSearch($event)"/>
    <!-- <button v-if="!edit" @click="slugify">Slugify</button> -->
    </div>
    
    <div class="flex flex-col bg-gray-100  text-sm" v-if="!edit && !loopEditor && products && !categories">
        
        <div :class="'w-full bg-gray-900 grid grid-cols-' + cols">
        <template v-for="field in Object.keys(schema)">
            <div class="capitalize font-bold p-2" v-if="schema[field].list">
                {{ field }}
            </div>
        </template>
        </div>
        <template v-for="product in products">
            <div :key="product._id" :class="'text-black text-lg w-full p-1 border-b border-l border-r cursor-pointer text-sm grid grid-cols-' + cols" v-if="product.name" @click="editor.current=product,edit=true">
                <template v-for="field in Object.keys(schema)">
                    <div :key="field" v-if="schema[field].list">
                        <span v-if="schema[field].type==='string'">{{ product[field] }}</span>
                        <div class="w-24" v-if="schema[field].type==='image_uri'">
                            <!-- <img :src="product[field]" v-if="!product.hasOwnProperty('image')" class="w-24"/> -->
                            <span v-if="!product.hasOwnProperty('image')" class="w-24"></span>
                            <img :src="productImage(product)" class="h-24 w-24 object-cover"/>
                        </div>
                        <span v-if="schema[field].type==='array'">
                            {{ product[field].length ? product.field.join(',') : '' }}
                        </span>
                        <span v-if="schema[field].type==='list'">
                            {{ productFieldList(product[field],schema[field].separator) }}
                        </span>
                        <span v-if="schema[field].type==='currency'">
                            {{ product[field] && parseInt(product[field]) ? Number(product[field]).toFixed(schema[field].precision) : '-' }}
                        </span>
                        <span v-if="schema[field].type==='select'">
                            {{ Array.isArray(product[field]) ? product[field].join(',') : product[field] }}
                        </span>
                        <span v-if="field === 'collection'">
                            {{ product.category }}
                        </span>
                    </div>
                </template>
            </div>
        </template>
        <div class="grid grid-cols-3 p-2">
            <div>Total: {{ total }}</div>
            <navigation 
                size="4xl"
                @prev="skip>0?skip=skip-limit:null" 
                @next=" total - (skip+limit) > 0 ? skip=skip+limit:null"/>
            <div class="text-right">
                {{ skip+1 }} - {{ pageTotal }}
            </div>
        </div>
        
    </div>
    <product-edit v-if="edit" :id="editor.current._id" @close="edit=!edit"/>
    <products-loop-editor v-if="loopEditor" :plugin="plugin"/>
    <products-categories v-if="categories"/>
    <!-- <modal
        size="lg"
        position="modal"
        v-if="edit"
        @close="edit=!edit"
        buttons="save"
        @click_0="edit=!edit"
        @click_1="productSave">
        <div slot="title">{{ current.name }}</div>
        <div slot="content">
            <product-edit :id="current._id"/>
        </div>
    </modal> -->
    <modal
        size="lg"
        position="modal"
        v-if="importFile"
        @close="importFile=!importFile"
        button="none">
        <div slot="title">Import Products</div>
        <moka-products-import slot="content"/>
    </modal>
    <modal
        size="lg"
        position="modal"
        v-if="exportFile"
        @close="exportFile=!exportFile"
        @click_0="exportFile=!exportFile"
        @click_1="exportData">
        <div slot="title">Export Products</div>
        <moka-products-export slot="content"/>
    </modal>
    <!-- <modal
        class="h-screen"
        v-if="categories"
        size="md"
        position="modal-top-right"
        buttons="none"
        @close="categories=!categories">
        <div slot="title">Categories</div>
        <products-categories slot="content"/>
    </modal> -->
</div>
</template>

<script>
import MokaProductsImport from './products.import'
import MokaProductsExport from './products.export'
import productsImportVue from './products.import.vue'
import { mapState } from 'vuex'
import model from '../model.js'
export default {
    name: 'MokaProducts',
    data:()=>({
        edit: false,
        loopEditor: false,
        categories: false,
        importFile: false,
        exportFile: false,
        products: null,
        current: null,
        limit: 10,
        skip:0,
        search: '',
        cols: 0,
        images: false,
        total:0,
        plugin: null
    }),
    components:{
        MokaProductsImport , MokaProductsExport,
        'product-edit'  : () => import ( './products.edit.vue' ),
        'products-categories' : () => import ( './products.categories.vue'),
        'products-loop-editor'   : () => import ( './products.loop.editor.vue')
    },
    computed:{
        ...mapState ( [ 'datastore' , 'editor'] ),
        schema(){
            let schema = model ///this.datastore.schema.products
            this.plugin = this.$mapState().desktop.tabs [ this.$mapState().desktop.currentTab ].plugin
            Object.keys(schema).map ( field => {
                if ( schema[field].list ) this.cols++
            })
            return schema
        },
        pageTotal(){
            return ( this.skip + this.limit > this.total ) ? this.total : this.skip + this.limit
        }
    },
    watch:{
        skip(v){
            if ( !this.search ){
                this.qry()
            } else {
                this.qrySearch()
            }

        }
    },
    methods: {
        qry(){
            this.$api.service('products').find( { query: { $limit: this.limit , $skip: this.skip , type: 'product' }}).then ( res => {
                this.products = res.data
                this.total = res.total
                this.products.map ( product => {
                    !product.hasOwnProperty('image') ?
                        product.image = null : null
                    // if ( !product.assets[0].includes('/products/') ){
                    //     this.$api.service ( 'upload/file' ).create ( {
                    //         url: 'http://localhost:3030' + product.assets[0],
                    //         name: this.$slugify(product.name),
                    //         folder: 'products'
                    //     }).then ( res => {
                    //         console.log ( 'Uploaded image for => ' , product.name )
                    //     })
                    // }
                    // product.seo_title = product.name
                    // product.seo_description = product.description
                    // this.$api.service ('products').patch ( product._id , product).then ( res => {
                    //     console.log ( res.name + ' updated')
                    // })
                    // let assets = []
                    // !Array.isArray( product.assets ) ?
                    //     product.assets ?
                    //         product.assets = [ product.assets ] : null : null
                })  
                // this.products.forEach ( product => {
                //     let price_val = {
                //         price_value : parseFloat(product.price)
                //     }
                //     this.$api.service ( 'products' ).patch ( product._id , price_val )
                // })
            })
        },
        qrySearch(){
            this.$api.service ( 'products' ).find ( { query :  { $limit: this.limit , $skip: this.skip , $search : this.search  } } ).then ( res => {
                this.products = res.data
                this.total = res.total 
            })
        },
        importData(){
            return 
        },
        exportData(){
            return
        },
        productImage(product){
            return !Array.isArray ( product.assets ) ?
                this.$imageURL(product.assets) : this.$imageURL(product.assets[0])
        },
        productFieldList ( value , separator ){
            return value.split(separator).join('-').replaceAll('category:','')
        },
        productSave(){
            //this.editor.current.image_uri = this.editor.image
            
            this.$api.service ( 'products' ).patch ( this.editor.current._id , this.editor.current ).then ( res => {
                this.$message ( 'Product data saved' )
                this.editor.current = null
                this.edit = false
            })
        },
        productCreate(){
            let fields = Object.keys(this.schema)
            let product = {}
            fields.forEach ( field => {
                product[field] = null
            })
            product.name = 'New product'
            product.assets = []
            product.facets = []
            product.type = 'product'
            delete product._id
            this.$api.service ( 'products' ).create ( product ).then ( res => {
                this.products.unshift ( res )
            })
        },
        productSearch(e){
            if ( e.keyCode === 13 ){
                if ( e.target.value.length > 2 ){
                    this.skip = 0
                    this.qrySearch()
                } else {
                    this.qry()
                }
            }
        }
    },
    mounted(){
        this.qry()

        /*this.$http.get ( 'content-type-builder/content-types' ).then ( res => {
            const uid = res.data.data.filter ( ct => {
                return ct.schema.name === 'Product'
            })
            return uid[0].uid
        }).then ( uid => {
            this.$http.get ( 'content-type-builder/content-types/' + uid ).then ( res => {
                this.schema = res.data.data.schema.attributes
            })
        })
        */
    }
}
</script>