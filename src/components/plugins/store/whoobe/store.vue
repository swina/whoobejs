<template>
    <div class="" v-if="products && $attrs.plugin.settings">
        <h1>STORE {{ $attrs.plugin.settings.general.css }}</h1>
    <div class="relative" :class="$attrs.plugin.settings.general.css">
        <div v-if="$attrs.plugin.settings.general.display.cart.enabled" class="w-full text-xs flex flex-row items-center justify-end snipcart-checkout">
            <span class="snipcart-items-count"></span>
            <icon :name="$attrs.plugin.settings.general.display.cart.name||'shooping_bag'" :class="$attrs.plugin.settings.general.display.cart.css"/>
            <!--<i class="material-icons">shopping_bag</i>-->
            <span class="snipcart-total-price"></span>  
        </div>
       

        <store-categories v-if="!current && $attrs.plugin.settings.loop.categories.enabled" :container="$attrs.plugin.settings.loop.categories.container" :css="$attrs.plugin.settings.loop.categories.css" @category="qryByCategory"/>
        
        <div class="flex flex-col md:flex-row" v-if="!current">
            <p v-if="$attrs.plugin.settings.general.display.total.enabled" :class="$attrs.plugin.settings.general.display.total.css">{{ $attrs.plugin.settings.general.display.total.name }} {{total}}</p>
            <input v-if="$attrs.plugin.settings.general.display.search.enabled" type="text" :class="$attrs.plugin.settings.general.display.search.css" :placeholder="$attrs.plugin.settings.general.display.search.name" v-model="search" @keydown="productSearch($event)"/><icon name="zoom" class="visible md:invisible"/>
        </div>

        <div v-if="!products.length"><h3>No products found!</h3></div>

        <div v-if="!current" class="flex flex-col items-center justify-center" :class="$attrs.plugin.settings.loop.container">
            <template v-for="(product,index) in products">
                <div v-if="index>=start && index<(start+limit)" class="flex flex-col" :class="$attrs.plugin.settings.loop.css" @click="current=product,currentPrice=product.price,currentOption=product.optionValues,variations(product.sku)">
                    <template v-for="field in $attrs.plugin.settings.loop.fields">
                        
                        <div :class="field.css" v-if="schema[field.name].type!='image_uri' && field.name !='add_to_cart'">
                            <small class="mr-1" v-if="schema[field.name].type==='currency'">{{ $attrs.plugin.settings.general.currency }}</small>
                            {{ schema[field.name].type==='currency' ? parseFloat(product[field.name]).toFixed(2) : product[field.name] }}
                        </div>
                        <div v-else>
                            <img :src="productImage(product[field.name])" :class="field.css" v-if="field.name != 'add_to_cart'">
                            <button v-if="field.name==='add_to_cart'" :class="field.css">Add to cart</button>
                        </div>
                    </template>
                </div>
            
            </template>
        </div>
        <!-- PAGINATION -->
        <div v-if="!current">
            <div class="flex flex-row w-full items-center justify-center" v-if="$attrs.plugin.settings.general.display.navigation">
                <template v-for="page in pages">
                    <div :class="$attrs.plugin.settings.general.display.navigation.css + ' ' + activePage(page)" @click="start=(page-1)*limit">{{ page }}</div>
                </template>
            </div>
        </div>


        <!-- SINGLE VIEW -->
        <div v-if="current" class="fixed inset-0 overflow-y-auto h-screen md:relative md:h-auto">
            <div :class="$attrs.plugin.settings.single.css + ' '  + $attrs.plugin.settings.single.container">
                <icon name="close" class="absolute right-0 top-0 text-3xl" @click="current=null"/>
                <div v-for="n in parseInt($attrs.plugin.settings.single.cols)">    

                    <template v-for="field in $attrs.plugin.settings.single.fields">
                        <span v-if="schema[field.name] && parseInt(field.col)===(n-1)">
                            <div :class="field.css" v-if="schema[field.name].type==='text' || schema[field.name].type === 'string'">
                                <span v-if="field.name!='sku'">{{ current[field.name] }}</span>
                                <span v-else>SKU {{ !currentVariation ? current[field.name] : currentVariation.sku }}</span>
                            </div>
                            <div :class="field.css" v-if="schema[field.name].type==='list' && field.name != 'optionValues'">
                                {{ current[field.name].split ( schema[field.name].separator ).join('-') }}
                            </div>
                            <div v-if="field.name === 'optionValues'" class="flex flex-col">
                                
                                <div class="relative flex flex-col md:flex-row" v-if="productVariations && productVariations.length">
                                    <div :class="variationSelected(current.optionValues,field.css)" @click="currentPrice=current.price,currentOption=current.optionValues,currentVariation=null">{{ current[field.name] }}</div>
                                    <div v-for="variation in productVariations" :class="variationSelected(variation.optionValues,field.css)" @click="currentPrice = variation.price,currentOption=variation.optionValues,currentVariation=variation">
                                        {{ variation.optionValues }}
                                    </div>
                                </div>

                            </div>
                            <div :class="field.css" v-if="schema[field.name].type==='currency'">
                                <small class="mr-1">{{ $attrs.plugin.settings.general.currency }}</small>
                                <span>{{ parseFloat(currentPrice).toFixed(2) }}</span>
                            </div>
                            <div :class="field.css" v-if="field.name==='category'">
                                {{ current[field.name] }}
                            </div>
                            <div :class="field.css" v-if="field.name==='facets'">
                                {{ current[field.name].join(' - ') }}
                            </div>
                            <div v-if="schema[field.name].type==='image_uri'" class="flex flex-col"> 
                                <img :src="productImage(current[field.name])" :class="field.css">
                                <div class="flex flex-row flex-wrap">
                                    <template v-for="(asset,i) in current.assets" v-if="Array.isArray(current.assets)">
                                        <img :src="$imageURL(asset)" class="w-16 h-16 border object-cover mt-1 mb-1 mr-1" :title="asset" @click="currentImageIndex=i"/>
                                    </template>
                                </div>
                            </div>
                        </span>
                        <button v-if="parseInt(field.col)===(n-1) && field.name === 'add_to_cart'" 
                            :key="field.name"
                            :class="field.css"
                            :data-item-id="current._id"
                            :data-item-image="productImage(current.assets)"
                            :data-item-price="currentPrice"
                            :data-item-name="current.name + ' ' + currentOption"
                            :data-item-description="currentOption"
                            :data-item-url="'/store/product/' + current._id"> 
                        Add to cart</button>
                        
                    </template>
                </div>
            </div>
        </div>
        
        
    </div>
    
    <whoobe-snipcart :apikey="$attrs.plugin.settings.general.cart"/>
    </div>
</template>

<script>
//import language from '@/components/plugins/store/whoobe/en.js'
//import MokaPreview from '@/components/editor/preview/moka.preview.container'
import model from './model.js'
export default {
    name: 'WhoobeStore',
    components: {
        'store-categories' : () => import ( './store.categories.vue' )
    },
    data:()=>({
        apikey: false,
        lang: null,
        language : {
            en : {
                products: 'Products',
                buy : 'Buy',
                add_to_cart: 'Add to cart',
                checkout: 'Checkout',
                detail: 'Detail'
            },
            it : {
                products: 'Prodotti',
                buy : 'Acquista',
                add_to_cart: 'Aggiungi al carrello',
                checkout: 'Vai alla cassa',
                detail: 'Dettaglio'
            }
        },
        start: 0,
        total: 0,
        search:'',
        current: null,
        products: null,
        allProducts: null,
        productVariations: null,
        allVariations: null,
        currentPrice:null,
        currentOption: null,
        currentVariation: null,
        currentImageIndex:0,
        settings: null,
        customize: false,
        schema: null,
        filter: null
    }),
    props:['editor'],
    computed:{
        limit(){
            return parseInt(this.$attrs.plugin.settings.loop.limit)
        },
        pages(){
            let p = parseInt(( this.total / this.limit ))
            p * this.limit < this.total ?
                p++ : null 
            return p
        },
        categories(){
            return store.categories
        }
    },
    watch:{
        start(){
            return
            //this.scrollTop()
                this.search ? 
                    this.qrySearch(null) :
                        this.filter ?
                            this.filter.field === 'category' ?
                                this.qryByCategory ( this.filter.value , true ) : 
                                    this.qry() : this.qry()
        },
        
        current(v){
            if ( v ){
                window.sessionStorage.setItem('moka-product-view',JSON.stringify(v))
            }
        }
    },
    methods:{
        productImage ( asset ){
            return !Array.isArray(asset) ?
                this.$imageURL(asset) : this.$imageURL(asset[this.currentImageIndex]) 
        },
        variationSelected(variation,css){
            return variation === this.currentOption ?
                css + ' bg-black text-white' : css
        },
        variations(sku){
            this.productVariations = this.allVariations.filter ( variation => {
                return variation.parent === sku 
            })
            return
            // this.$api.service ( 'products' ).find ( { query : { type: 'variation' , parent: sku , $sort : { price: 1 , optionValues: 1 } }}).then ( res => {
            //     console.log ( res )
            //     this.productVariations = res.data
            // })
        },
        async qry(){
            console.log ( this.$shop() )
            this.products = this.$shop().products.data
            this.allProducts = this.$shop().products.data
            this.total = this.$shop().products.total
            this.allVariations = this.$shop().variations.data

            // fetch(import.meta.env.VITE_API_URL + 'products?$limit=100&$skip=' + this.start + '&type=product')
            //     .then ( res => res.json())
            //     .then ( products => {
            //         this.total = products.total
            //         this.products = products.data
            //         this.allProducts = products.data
            // })
            // fetch(import.meta.env.VITE_API_URL + 'products?$limit=300&$skip=' + this.start + '&type=variation')
            //     .then ( res => res.json())
            //     .then ( products => {
            //         console.log ( products )
            //         this.allVariations = products.data
            // })
            // this.$api.service('products').find ( { query : { $limit: this.limit , $skip : this.start , type: 'product'  }}).then ( result => {
            //     this.products = result.data
            //     this.total = result.total
            // })
        },
        qryByCategory ( category , skip ){
            this.search = ''
            !skip ? this.start = 0 : null

            this.products = this.allProducts.filter ( product => {
                return product.category === category
            })

            this.total = this.products.length

            // this.filter = { field: 'category' , value: category }
            // this.$api.service('products').find ( { query : { $limit: this.limit , $skip : this.start , type: 'product' , category : category }}).then ( result => {
            //     this.products = result.data
            //     this.total = result.total
            // })
        },
        qrySearch(){
            this.$api.service ( 'products' ).find ( { query :  { $limit: this.limit , $skip: this.start , $search : this.search  } } ).then ( res => {
                this.products = res.data
                this.total = res.total 
            })
        },
        randomImage(name){
            return 'https://source.unsplash.com/600x400?fashion&' + name
        },
        scrollTop(){
            // element which needs to be scrolled to
            var element = document.querySelector("#storeTop");
            // scroll to element
            element.scrollIntoView();
        },
        discount(price,sale){
            let discount = (parseFloat(price)-parseFloat(sale))
            return parseFloat(discount).toFixed(2) + '%'
        },
        productSearch(e){
            if ( !e ){
                this.qrySearch()
            } else { 
                if ( e.keyCode === 13 ){
                    if ( e.target.value.length > 2 ){
                        this.start = 0
                        this.qrySearch()
                    } else {
                        this.qry()
                    }
                }
            }
        },
        activePage(page){
            if ( (page-1) * this.limit === this.start ){
                return 'animate-pulse'
            }
        }
    },
    mounted(){
        //this.lang = language[navigator.language||'en']
        //let whoobe = JSON.parse(window.localStorage.getItem('whoobe'))
        //console.log ( this.$attrs.plugin.editor.settings )
        //if ( this.$attrs.config.mode != 'static' ){
            //this.$http.get('products').then ( res => {
            console.log ( 'Fetching store ...')
            this.lang = this.language[navigator.language||'en']
            !this.lang ? this.lang = this.language['en'] : null
            this.settings = this.$attrs.plugin.settings
            this.schema = model
            this.qry()
        //} else {
        //    this.products = products
        //    this.total = products.length
        //}
    }
}
</script>

<style>

.animateme {
    transition: all .5s linear;
}
</style>