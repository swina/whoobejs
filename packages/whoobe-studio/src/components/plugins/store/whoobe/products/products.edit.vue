<template>
    <div v-if="editor.current" class="bg-gray-100 text-black p-2 text-lg relative">
        <!-- <icon css="absolute right-0 top-0 text-3xl" name="close" @click="$emit('close')"/> -->
        <div class="flex flex-row items-center">
            <icon :name="active?'toggle_on':'toggle_off'" css="text-5xl" :class="active?'text-green-500':'text-red-500'" @click="active=!active"/> Active
        </div>
        <div class="grid grid-cols-12 border-t">
            <div class="col-span-2 flex flex-col">
                <template v-for="gr in groups">
                    <div :class="group===gr?'bg-white font-bold':''" class="capitalize p-2 border-b border-l cursor-pointer hover:bg-white" @click="group=gr">{{gr}}</div>
                </template>
            </div>

        
            <div class="border-l col-span-10 grid grid-cols-2 gap-4 p-2 bg-gray-100 text-gray-700">
                <template v-for="field in Object.keys(schema)">
                    <div v-if="schema[field].edit && schema[field].group === group" class="flex flex-col text-gray-800">
                        <label class="capitalize">{{ field.replace('_',' ') }}</label>
                        <input type="text" class="p-2 bg-white rounded border text-base w-full" v-if="schema[field].type==='string'" v-model="editor.current[field]"/>
                        <input type="checkbox" v-if="schema[field].type==='boolean'" v-model="editor.current[field]"/>
                        <textarea v-if="schema[field].type==='text'" class="p-2 bg-white rounded border text-base w-full h-64" v-model="editor.current[field]"/>
                        <input type="text" class="p-2 bg-white rounded border text-base" v-if="schema[field].type==='currency'" min="0" v-model="editor.current[field]"/>
                        <div  v-if="schema[field].type==='image_uri'">
                            <div class="flex flex-row">
                                <img v-if="editor.current.assets" :src="productImage" class="w-64 h-56 object-cover" :title="productImage"/> 
                                <div class="flex flex-row flex-wrap">
                                    <template v-for="(asset,i) in editor.current.assets" v-if="editor.current.assets.length > 1">
                                        <img :src="$imageURL(asset)" class="w-16 h-16 border object-cover ml-1 mb-1 mr-1" :title="asset" @click="assetsIndex=i"/>
                                    </template>
                                </div>
                            </div>
                            <button @click="assetMode='replace',$action('media')">Replace</button> 
                            <button @click="assetMode='add',$action('media')">Add</button>
                            <button v-if="editor.current.assets.length>1" @click="editor.current.assets=editor.current.assets.filter((a,i)=> i != assetsIndex)">Remove</button>
                            <button v-if="editor.current.assets[0].includes('//')" @click="importImageFromUrl()">Save as local</button>

                        </div>
                        <div v-if="schema[field].type==='list' && !field==='facets'" class="flex flex-row flex-wrap">
                            <template v-for="f in editor.current[field].split(schema[field].separator)">
                                <chip icon="close" :content="f" css="text-base bg-indigo-400 rounded text-white mr-2"/>
                                <!-- <div class="flex items-center p-1 text-base bg-indigo-400 rounded text-white mr-2">{{ f }} <icon name="close"/></div> -->
                            </template>    
                        </div>
                        <div v-if="field==='category'" class="flex flex-row flex-wrap">
                            <chip v-if="editor.current.category" icon="close" :content="editor.current.category" css="text-base bg-indigo-400 rounded text-white mr-2"/>

                            <!--<div v-if="editor.current.category" class="flex items-center p-1 text-base bg-indigo-400 rounded text-white mr-2">{{ editor.current.category }} <icon name="close"/></div>-->
                            <select v-model="collection" class="p-2 bg-white" @change="getFacets()">
                                <option v-for="category in categories" :value="category">{{ category.name }}</option>
                            </select>
                        </div>
                        <div v-if="field==='facets'" class="flex flex-col">
                            <div class="flex flex-row flex-wrap">
                                <!-- <template v-for="facet in collectionFacets">
                                    <chip css="text-base border bg-white text-black rounded mr-2" :content="facet.name" icon="add" @click="addFacet(facet)"/>
                                </template> -->
                                <select v-model="productFacet" class="p-2 bg-white border rounded" @change="addFacet()">
                                    <option v-for="facet in collectionFacets" :value="facet">{{ facet.name }}</option>
                                </select>
                            </div>
                            <div class="flex flex-row flex-wrap mt-4">
                                <template v-if="Array.isArray(editor.current.facets)" v-for="(facet,i) in editor.current.facets">
                                    <chip v-if="facet" css="text-base bg-teal-400 rounded text-white mr-2" :content="facet" icon="close" @click="editor.current.facets.splice(i,1)"/>
                                    <!--<div v-if="facet" class="flex items-center p-1 text-base bg-teal-400 rounded text-white mr-2">{{ facet }} <icon name="close" @click="editor.current.facets.splice(i,1)"/></div>-->
                                </template>
                            </div>
                        </div>
                        <div v-if="field==='upsell'">
                            <div class="flex flex-col">
                                <textarea class="w-full h-64 px-2 py-2 border" v-model="editor.current.upsell" placeholder="search" @focus="currentField='upsell',ids=true"/>
                                <!-- <select class="w-1/2 px-2 py-2 border" v-model="editor.current[field]">
                                    <option v-if="!products" value="">at least 3 characters</option>
                                    <option class="px-2 py-2" v-for="product in products" :value="product.name">
                                        <span class="p-2">{{ product.name }}</span></option>
                                </select> -->
                            </div>
                        </div>    
                        
                    </div>
                </template>
                <div class="flex flex-col w-full p-2 col-span-2 relative mb-8" v-if="group==='price'">
                    <icon name="add" @click="addOption()" class="text-black text-3xl absolute top-0 right-0 m-2"/>
                    <div class="grid grid-cols-3 w-full gap-3 border p-2 items-center justify-center">
                        <div>Option<span v-if="variations && variations.length">/Variation</span></div>
                        <div>SKU</div>
                        <div>Price</div>
                        <div>
                            <input type="text" class="p-2 bg-white rounded border text-base" v-model="editor.current.optionValues"/>
                        </div>
                        <div>
                            <input type="text" class="p-2 bg-white rounded border text-base" v-model="editor.current.sku"/>
                        </div>
                        <div>
                            <input type="text" class="p-2 bg-white rounded border text-base" v-model="editor.current.price"/>
                        </div>
                        <template v-for="(variation,i) in variations" v-if="variations">
                            <div>
                                <input type="text" class="p-2 bg-white rounded border text-base" v-model="variations[i].optionValues"/>
                            </div>
                            <div>
                                <input type="text" class="p-2 bg-white rounded border text-base" v-model="variations[i].sku"/>
                            </div>
                            <div>
                                <input type="text" class="p-2 bg-white rounded border text-base" v-model="variations[i].price"/>
                                <icon name="close" class="ml-4 text-3xl" @click="removeOption(variation._id,i)"/>
                            </div>
                        </template>
                    </div>
                </div>
           
            </div>
        </div>
         
        <div class="mt-2 absolute top-0 right-0">
            <button class="danger rounded lg m-auto mx-1" @click="$emit('close')">Close</button>
            <button class="success rounded lg m-auto mx-1" @click="saveProduct()">Save</button>
        </div>

        <modal 
            v-if="ids"
            size="sm"
            position="modal-top-right"
            @close="ids=!ids">
            <div slot="title">Select products</div>
            <div slot="content" class="relative overflow-y-auto h-3/4">
                <template v-for="product in products">
                    <div class="relative p-2 mb-1 border border-gray-900 text-gray-600 cursor-pointer flex flex-row items-center" @click="setIds(product)">
                        <img :src="Array.isArray(product.assets)?$imageURL(product.assets[0]):$imageURL(product.assets)" class="w-10 h-10 object-cover mr-1"/>
                        {{ product.name }}
                        <icon v-if="editor.current[currentField].includes(product.slug)" name="check" css="absolute right-0 text-lime-500"/>
                    </div>
                </template>
            </div>
        </modal>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import model from '../model.js'
export default {
    name: 'WhoobeProductEdit',
    data:()=>({
        groups:null,
        group: 'general',
        active: true,
        current: null,
        assetMode: 'replace',
        assetsIndex:0,
        images: false,
        variations: null,
        categories: null,
        collection:null,
        collectionFacets: null,
        productFacet: null,
        facets: null,
        upsell: '',
        crossell: '',
        ids: false,
        products: [],
        currentField: null
    }),
    props: ['id'],
    computed:{
        ...mapState(['editor']),
        schema(){
            let fields = Object.keys(model)
            let groups = []
            fields.forEach ( f => {
                if ( model[f].group ) groups.push ( model[f].group )
            })
            this.groups = [ ...new Set(groups) ]
            return model
            //return this.$mapState().datastore.schema.products
        },
        productImage(){
            if ( this.assetMode === 'replace' && this.editor.current.hasOwnProperty('image') && this.editor.current.image && this.editor.current.image.hasOwnProperty('url') ){
                this.editor.current.assets[this.assetsIndex] = this.editor.current.image.url
                delete this.editor.current.image
                this.assetMode = 'edit'
            }
            return ( this.$imageURL(this.editor.current.assets[this.assetsIndex]) )
        }
    },
    watch:{
        active(v){
            this.editor.current.active = v
        },
        search(v){
            if ( v && v.length > 2){
                this.$api.service('products').find ({
                    query : {
                        $limit: 200,
                        $search: this.search,
                        $sort: { name: 1 },
                        type: 'product'
                    }
                }).then ( res => {
                    this.products = res.data
                })
            }
        },
        upsell(value){
            this.editor.current.upsell = value
        },
        crossell(value){
            this.editor.current.crossell = value
        }
    },
    methods:{
        saveProduct(){
            this.editor.current.optionValues ? this.editor.current.optionValues = this.editor.current.optionValues.replaceAll('|',' ') : null
            this.editor.current.category = this.collection.name
            this.editor.current.category_id = this.collection._id
            if ( !this.editor.current.slug ) {
                this.editor.current.slug = this.$slugify(this.editor.current.name)
            }
            this.$api.service ( 'products' ).patch ( this.editor.current._id , this.editor.current ).then ( res => {
                this.$message ( 'Product saved' )
                console.log ( res )
                if ( this.variations && this.variations.length ){
                    this.variations.forEach ( variation => {
                        this.$api.service ( 'products' ).patch ( variation._id , variation ).then ( res => {
                            console.log ( 'save variation' , res )
                        })
                    })
                }
            })
        },
        getFacets(){

            //this.editor.current.category = this.collection.name 
            this.$api.service ( 'categories' ).find ( { query: { name : this.editor.current.category } } ).then ( res => {
                console.log ( res.data )
                if ( !res.data.length ){
                    let category = {
                        name: this.editor.current.category,
                        type: 'product',
                        slug: this.$slugify(this.editor.current.category),
                        active: true
                    }
                    this.$api.service('categories').create( category ).then ( cat => {
                        console.log ( 'created category => ' , cat )
                        if ( this.editor.current.facets ){
                            let facet = {
                                name: this.editor.current.facets[0],
                                type: 'facet',
                                slug: this.$slugify(this.editor.current.facets[0]),
                                active: true,
                                collection: cat._id
                            }
                            this.$api.service ( 'categories' ).create ( facet ).then ( fac => {
                                console.log ( 'created facet => ' , fac )
                            })

                        }
                    })
                } else {
                    this.$api.service ( 'categories' ).find ( { query: { collection: res.data[0]._id }} ).then ( res => {
                        this.collectionFacets = res.data
                    })     
                }
            })

        },
        addFacet(facet){
            console.log ( facet )
            this.productFacet = facet
            console.log ( this.productFacet )
            !Array.isArray(this.editor.current.facets) ? 
                this.editor.current.facets = [ this.productFacet.name ] : 
                    !this.editor.current.facets.includes ( this.productFacet.name ) ? this.editor.current.facets.push ( this.productFacet.name ) : null
        },
        removeFacet(i){
            this.editor.current.facets.splice(i,1)
        },
        addOption(){
            let obj = Object.assign ( {} , this.editor.current )
            obj.parent = obj.sku
            obj.sku = ''
            obj.type = 'variation'
            delete obj._id
            delete obj.createdAt
            delete obj.updatedAt
            this.$api.service ( 'products').create ( obj ).then ( res => {
                this.variations.push ( res )
            })
        },
        removeOption(id,index){
            this.$api.service ( 'products' ).remove ( id ).then ( res => {
                this.variations.splice(index,1)
            })
        },
        importImageFromUrl(){
            this.$api.service ( 'upload/file' ).create ( {
                url: this.editor.current.assets[0].replace('https','http'),
                name: this.$slugify(this.editor.current.name),
                folder: 'products'
            }).then ( res => {
                
                console.log ( res )
            })
        },
        setIds(product){
            let ids = []
            //this.editor.current[this.currentField] ?
            this.editor.current[this.currentField] ?
                ids = this.editor.current[this.currentField].split(',') : null
            if ( ids && ids.includes ( product.slug ) ){
                ids = ids.filter ( slug => slug != product.slug )
            } else {
                ids.push ( product.slug )
            }
            if ( ids.length )
                this.editor.current[this.currentField] = ids.join(',')
        }
    },
    mounted(){
        this.$api.service('media').on ( 'created' , (data) => {
            this.editor.current.assets[0] = data.url
            this.editor.current.image = null
            this.$api.service('products').patch ( this.editor.current._id , this.editor.current )
        })
        this.$api.service('products').find ( { query: { $limit:50 , parent: this.editor.current.sku , $sort : { optionValues:1 }} }).then ( res => {
            this.variations = res.data
        })
        this.$api.service('categories').find ( { query: { $limit:50 , type: 'product' , $sort: { name: 1 } } }).then ( res => {
            this.categories = res.data
            this.collection = this.editor.current.category ? res.data.filter(cat=>{ return cat.name === this.editor.current.category } )[0] : null
            if ( this.collection ) this.getFacets()
        })
        !this.editor.current.hasOwnProperty('active') ?
            this.editor.current.active = true : null
        !this.editor.current.hasOwnProperty('upsell') ?
            this.editor.current['upsell'] = '' : null  
        !this.editor.current.hasOwnProperty('crosssell') ?
            this.editor.current['crosssell'] = '' : null        

        this.facets = this.editor.current.facets ?  Array.isArray(this.editor.current.facets) ? null : this.editor.current.facets.split('|') : null
        this.editor.current.hasOwnProperty('image') && this.editor.current.image ?
            this.editor.current.assets[0] = this.editor.current.image : null
        this.$api.service('products').find ( {
            query: {
                $limit: 300,
                type: 'product',
                active: true,
                $sort: { name: 1 }
            }
        }).then ( res => {
            this.products = res.data 
        })
        // this.editor.current.facets = facets ? null : facets
    }
}
</script>