<template>
    <div class="" v-if="products" id="whoobestore">

        <!-- cart -->
        <div v-if="settings.general.display.cart.enabled" class="hidden w-full text-xs md:flex flex-row items-center justify-end snipcart-checkout  z-modal -mt-8 cursor-pointer">
            <span class="snipcart-items-count"></span>
            <icon  :name="settings.general.display.cart.name||'mi:shooping_bag'" :class="settings.general.display.cart.css"/>
            <span class="snipcart-total-price"></span>  
        </div>

        <!-- main container -->
        <div class="relative" :class="settings.general.css">
        
            <!-- only editor -->
            <div class="z-highest absolute right-0 -mr-10 flex flex-col justify-around items-center" v-if="editor && $mapState().editor.current.hasOwnProperty('plugin') &&  $mapState().editor.current && $mapState().editor.current.plugin._id === $attrs.plugin._id">
                <icon :name="!current?'web':'collections'" :title="!current?'View Single':'View Loop'" class="text-3xl mr-2" @click="!current?current=products[0]:current=null"/>
            </div>

            
            <!-- only editor customizer -->
            <icon name="brush" title="Customize" @click="customize=!customize" v-if="$mapState().editor.action==='in_editor_preview' &&  $mapState().editor.current"  class="absolute left-0 rounded-full border p-2 -m-10 bg-white z-highest hover:bg-purple-500 hover:text-white text-purple-500 text-3xl"/>


            <div class="flex flex-col md:flex-row justify-start w-full items-center relative">

                <!-- categories md: -->                
                <div class="w-full md:w-5/6 hidden md:flex" >
                    <store-categories  v-if="!current && !settings.general.sidebar && settings.general.display.categories.enabled" :container="settings.general.display.categories.container" :css="settings.general.display.categories.css" @category="qryByCategory"/>
                </div>


                <!-- categories mobile -->
                <transition name="slideleft">
                    <div class="fixed top-0 left-0 h-screen w-screen bg-white z-highest" :class="settings.general.display.categories.container" v-if="categories">
                        
                        <store-categories 
                            :sidebar="true" 
                            :category="category" 
                            :facet="facet"
                            :facets="settings.general.display.categories.facets"  
                            v-if="settings.general.display.categories.enabled" 
                            :container="settings.general.display.categories.container" 
                            :css="settings.general.display.categories.css" 
                            @category="qryByCategory" 
                            @facet="qryByFacet"/>
                       

                        
                    </div>
                </transition>

                <!-- filter mobile -->
                <transition name="slideright">
                    <div class="fixed z-modal bg-white h-screen p-2 flex flex-col top-0 right-0 w-full md:w-1/4 justify-start items-start py-4 shadow" v-if="!current && advancedFilter">
                        <span class="absolute top-0 right-0 cursor-pointer" @click="advancedFilter=!advancedFilter"><icon-extra icon="mi:close" class="text-3xl"></icon-extra></span>
                        
                        <store-filter 
                            v-if="settings.general.display.filter.enabled"
                            :settings="settings" 
                            @sort="qrySortBy"
                            @range="setPriceRange" 
                            @search="qrySearch"/>
                    </div>
                </transition>
            </div>

            

            <!-- PRODUCTS LIST -->
            
            <div v-if="!current" class="flex flex-col md:grid" :class="settings.general.sidebar ? 'md:grid-cols-12':'md:grid-cols-1'">

                <!-- sidebar md: -->
                <div v-if="settings.general.sidebar && !current" class="hidden md:flex flex-col md:col-span-3 xl:col-span-2 whoobe-store-sidebar">
                    <icon name="list" @click="list=!list"/>
                    <icon name="grid_on" @click="list=!list"/>
                    <div v-if="!products.length"><h3>No products found!</h3></div>
                    <div v-if="settings.general.display.total.enabled" :class="settings.general.display.total.css">{{ settings.general.display.total.name }} {{total}}</div>
                    <store-categories 
                        :sidebar="true" 
                        :category="category" 
                        :facet="facet"
                        :facets="settings.general.display.categories.facets"  
                        v-if="settings.general.display.categories.enabled" 
                        :container="settings.general.display.categories.container" 
                        :css="settings.general.display.categories.css" 
                        @category="qryByCategory" 
                        @facet="qryByFacet"/>
                    
                    <store-filter 
                        v-if="settings.general.display.filter.enabled"
                        :settings="settings" 
                        @sort="qrySortBy"
                        @range="setPriceRange" 
                        @search="qrySearch"
                        @reset="qry"/>
                </div>

                <!-- products loop -->
                <div class="flex flex-col whoobe-store-loop relative" :class="loopContainerClasse">
                    
                    <template v-for="(product,index) in products">
                        <div :key="product._id" class="flex flex-col" :class="productsClasse" @click="scrollTop(),current=product,currentPrice=product.price,currentOption=product.optionValues,variations(product.sku)">
                            <template v-for="field in settings.loop.fields">
                                <div :class="field.css" v-if="schema[field.name].type!='image_uri' && field.name !='add_to_cart'" :title="product.name">
                                    <small class="mr-1" v-if="schema[field.name].type==='currency'">{{ settings.general.display.currency.symbol }}</small>
                                    {{ schema[field.name].type==='currency' ? parseFloat(product[field.name]).toFixed(2) : product[field.name] }}
                                </div>
                                <div v-else>
                                    <img :src="productImage(product[field.name])" :class="field.css" v-if="field.name != 'add_to_cart'" :title="product.name" :alt="product.name">
                                    <button v-if="field.name==='add_to_cart'" :class="field.css">Add to cart</button>
                                </div>
                            </template>
                        </div>
                    
                    </template>

                    <!-- PAGINATION -->
                    <store-pagination 
                             v-if="settings.general.display.pagination.enabled && pages > 1 && !current"
                            :pages="pages"
                            :start="start" 
                            :limit="limit" 
                            :settings="settings" 
                            @page="setPage"/>
                    
                    <store-slider 
                        v-if="settings.loop.slider && pages > 1"
                        :pages="pages"
                        :start="start"
                        :limit="limit"
                        :max="max"
                        :settings="settings"
                        @cursor="setCursor"/>
                    
                </div>
            </div>
            <!-- desktop single view -->
                    <!-- single view is displayed in the products loop container -->
                    <transition name="fade">
                        <div v-if="current" class="w-full top-0 left-0 invisible md:visible">
                            <div class="flex items-center h-12 w-full text-left z-highest text-base ml-2 whoobe-single-back-desktop cursor-pointer" @click="scrollTop(),current=null">
                                <span @click="qryByCategory(current.category)">{{ current.category }}</span><span v-if="facet" @click="qryByFacet(facet)"> - {{ facet }}</span>
                            </div>
                            <div single-desktop v-if="current" :class="singleClasseMD">
                                
                                <div v-for="n in settings.single.cols" class="flex flex-col items-start">    

                                    <template v-for="field in settings.single.fields">
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
                                                <small class="mr-1">{{ settings.general.currency }}</small>
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
                                        
                                        <div class="flex flex-row items-center" v-if="parseInt(field.col)===(n-1) && field.name === 'add_to_cart'">
                                            <div class="flex items-center rounded border mr-2 text-lg cursor-pointer">
                                                <div class="bg-transparent w-8 h-10 flex items-center justify-center border-r" @click="qty>1?qty--:null">-</div>
                                                <input class="text-lg bg-transparent text-center w-20 h-10" type="text" readonly v-model="qty"/>
                                                <div class="bg-transparent w-8 h-10 flex items-center justify-center border-l" @click="qty++">+</div>
                                            </div>
                                            <button 
                                                @click="current=null"
                                                :key="field.name"
                                                :class="field.css"
                                                :data-item-quantity="qty"
                                                :data-item-id="current._id"
                                                :data-item-image="productImage(current.assets)"
                                                :data-item-price="currentPrice"
                                                :data-item-name="current.name + ' ' + currentOption"
                                                :data-item-description="currentOption"
                                                :data-item-url="'/store/product/' + current._id"> 
                                            Add to cart</button>
                                        </div>
                                    </template>
                                    
                                </div>
                            </div>
                        </div>
                    </transition>

            <!-- mobile single view -->
            <div :id="single_product_id">
                <transition name="fade">    
                    <div single-responsive v-if="current" :class="singleClasse" class="md:hidden">
                        <div class="absolute right-0 top-0 bg-white p-2">
                            <icon name="close" class="text-3xl" @click="current=null"/>
                        </div>
                        <div v-for="n in 2" class="flex flex-col items-start">    

                            <template v-for="field in settings.single.fields">
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
                                        <small class="mr-1">{{ settings.general.currency }}</small>
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
                                
                                <div class="flex flex-row items-center" v-if="parseInt(field.col)===(n-1) && field.name === 'add_to_cart'">
                                    <div class="flex items-center rounded border mr-2 text-lg cursor-pointer">
                                        <div class="bg-transparent w-8 h-10 flex items-center justify-center border-r" @click="qty>1?qty--:null">-</div>
                                        <input class="text-lg bg-transparent text-center w-20 h-10" type="text" readonly v-model="qty"/>
                                        <div class="bg-transparent w-8 h-10 flex items-center justify-center border-l" @click="qty++">+</div>
                                    </div>
                                    <button 
                                        @click="current=null"
                                        :key="field.name"
                                        :class="field.css"
                                        :data-item-quantity="qty"
                                        :data-item-id="current._id"
                                        :data-item-image="productImage(current.assets)"
                                        :data-item-price="currentPrice"
                                        :data-item-name="current.name + ' ' + currentOption"
                                        :data-item-description="currentOption"
                                        :data-item-url="'/store/product/' + current._id"> 
                                    Add to cart</button>
                                </div>
                            </template>
                            
                        </div>
                            <!-- </div> -->
                        <!-- </modal> -->
                    </div>
                </transition>
                
                <!-- <div v-if="current" class="z-10 fixed inset-0 w-screen h-screen bg-black bg-opacity-50"></div> -->
            </div>
            

            
        </div>

        <!-- navigation bar responsive only -->
        <div v-if="settings.general.display.navigation.enabled && !current" :class="settings.general.display.navigation.css" class="md:hidden z-modal cursor-pointer bottom-0">

            <icon v-if="settings.general.display.navigation.home" label="Home" name="home" @click="$router.push('/')" :css="settings.general.display.navigation.icons_css"/>        

            <icon v-if="settings.general.display.categories.enabled" label="Categories" name="list" @click="categories=!categories" :css="settings.general.display.navigation.icons_css"/>    
    
            <icon v-if="settings.general.display.search" label="Filter" name="search" @click="advancedFilter=!advancedFilter" :css="settings.general.display.navigation.icons_css"/>
    
            <span v-if="settings.general.display.cart" class="snipcart-checkout">
                <icon :name="settings.general.display.cart.name || 'shooping_bag'" label="Cart" :css="settings.general.display.navigation.icons_css"/>
            </span>
        </div>

        <!-- settings (only editor) -->
        <modal 
            v-if="!editor && customize"
            @close="customize=!customize"
            size="sm"
            position="modal-bottom-right"
            buttons="none">
            <div slot="title">Customize</div>
            <div slot="content">
                <store-customize :customize="current?'single':'loop'"/>
            </div>
        </modal>

        
    </div>
</template>

<script>
import model from './model.js'
export default {
    name: 'WhoobeStore',
    components: {
        'store-customize' : () => import ( './admin/settings.vue' ),
        'store-categories' : () => import ( './store.categories.vue' ),
        'store-filter' : () => import ( './store.filter.vue'),
        'store-pagination'  : () => import ( './store.pagination.vue' ),
        'store-slider'  : () => import ( './store.slider.vue' ),
        'double-range'      : () => import ( '@/components/common/double.range.vue')
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
        max:9999,
        list: false,
        search:'',
        advancedFilter: false,
        categories: false,
        current: null,
        qty:1,
        allProducts: null,
        products: null,
        productVariations: null,
        currentPrice:null,
        currentOption: null,
        currentVariation: null,
        currentImageIndex:0,
        settings: null,
        customize: false,
        schema: null,
        filter: null,
        priceRange: {
            min: 0,
            max: 3000
        },
        category: '',
        facet: '',
        sort: '',
        qryPrice: false,
        qryFacet: false,
        qryIds: ''
    }),
    props:['editor'],
    computed:{
        single_product_id(){
            return this.$randomID()
        },
        loopContainerClasse(){
            return this.settings.general.sidebar ?
                 'md:col-span-9 xl:col-span-10 ' + this.settings.loop.container.replace('flex-no-wrap','flex-wrap') :
                    'md:col-span-12 ' + this.settings.loop.container.replace('flex-no-wrap','flex-wrap')

        },
        productsClasse(){
            return !this.current ?
                this.settings.loop.css : 'hidden' 
        },
        singleClasse(){
            return 'fixed z-modal overflow-y-auto inset-0 md:modal min-h-screen w-screen ' + this.settings.single.css + ' ' + this.settings.single.container
        },
        singleClasseMD(){
            return this.settings.single.css + ' ' + this.settings.single.container
        },
        limit(){
            return parseInt(this.$attrs.plugin.settings.loop.records.limit)
        },
        pages(){
            let p = parseInt(( this.total / this.limit ))
            p * this.limit < this.total ?
                p++ : null 
            return p
        }
    },
    watch:{
        start(v){
            //this.scrollTop()
            this.qry()
        },
        
        current(v){
            if ( v ){
                this.qty = 1
                window.sessionStorage.setItem('moka-product-view',JSON.stringify(v))
            }
        },
    },
    methods:{

        setPage(n){
            console.log ( 'page=>' , n )
            this.start = n
        },
        setCursor(n){
            if (  parseInt(n) < this.max  && (parseInt(n)+parseInt(this.limit)) <= this.total ){
                this.start = n
            } else {
                this.start = parseInt(n) - parseInt(this.limit)
            }
        },
        setPriceRange(min,max){
            console.log ( min , max )
            this.advancedFilter = false
            this.priceRange = {
                min: min,
                max: max
            }
            
            this.qryPrice = true
            this.qry()
        },

        productImage ( asset ){
            return !Array.isArray(asset) ?
                this.$imageURL(asset) : this.$imageURL(asset[this.currentImageIndex]) 
        },
        
        variationSelected(variation,css){
            return variation === this.currentOption ?
                css + ' bg-black text-white' : css
        },
        
        variations(sku){
            console.log ( sku )
            this.$api.service ( 'products' ).find ( { query : { type: 'variation' , parent: sku , $sort : { price: 1 , optionValues: 1 } }}).then ( res => {
                console.log ( res )
                this.productVariations = res.data
            })
        },
        
        qry(){
            this.current = null
            let qry = {
                $limit : this.limit ,
                $skip  : this.start,
                type   : 'product'
            }
            
            if ( this.qryPrice ){
                qry['$and'] = [ 
                    { price_value : { $gte: this.priceRange.min }} , 
                    { price_value : { $lte: this.priceRange.max }} , 
                ]
            }
            if ( this.category ){
                qry['category'] = this.category
            }
            if ( this.facet ){
                qry['facets'] = this.facet
            }
            if ( this.sort ){
                this.sort === 'priceASC' ?
                    qry['$sort'] = { price_value : 1 } :
                        qry['$sort'] = { price_value : -1 }
            }
            //console.log ( 'Query=>' , qry )
            this.$api.service('products').find ( 
                { 
                    query : qry 
                }).then ( result => {
                    this.allProducts = result.data
                    this.products = result.data
                    this.total = result.total
            })
        },
        qrySortBy(order){
            this.sort = order 
            // order === 'priceASC' ?
            //     this.products.sort ( (a,b) => a.price - b.price ) :
            //         this.products.sort ( (a,b) => b.price - a.price )
        },
        qryByCategory ( category , skip ){
            
            this.categories = false
            this.category = category
            this.facet = ''
            this.qry()

        },
        qryByFacet ( facet , skip ){
            this.categories = false
            this.category = ''
            this.facet = facet
            this.qry()
        },
        qrySearch(search){
            this.search = search
            this.$api.service ( 'products' ).find ( { query :  { $limit: this.limit , $skip: this.start , $search : this.search  } } ).then ( res => {
                this.allProducts = res.data
                this.products = res.data
                this.total = res.total 
                this.advancedFilter = false
            })
        },
        // qryByPrice(){
        //     console.log ( this.start , this.limit )
        //     this.$api.service ( 'products' )
        //         .find ({ 
        //                 query :  { 
        //                     $limit: this.limit , 
        //                     $skip: this.start,
        //                     $and : [ 
        //                         { price_value : { $gte: this.priceRange.min }} , 
        //                         { price_value : { $lte: this.priceRange.max }} , 
        //                     ],
        //                     $sort: { price_value : 1 },
        //                     type: 'product'
        //                 }
        //         })
        //         .then ( res => {
        //             this.allProducts = res.data
        //             this.products = res.data
        //             this.total = res.total
        //             console.log ( res )
        //         }).catch ( error => {
        //             console.log ( error )
        //         })
        // },
        // randomImage(name){
        //     return 'https://source.unsplash.com/600x400?fashion&' + name
        // },
        scrollTop(single){
            // element which needs to be scrolled to
            const element = document.querySelector("#whoobestore") 
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
        this.lang = this.language[navigator.language||'en']
        !this.lang ? this.lang = this.language['en'] : null
        this.settings = this.$attrs.plugin.settings
        this.settings.loop.hasOwnProperty('max') ?
            this.max = parseInt(this.settings.loop.max) : null
        this.schema = model
        if ( this.settings.loop.ids ){
            this.qryIds = this.settings.loop.ids
        }
        this.qry()
        
    }
}
</script>
