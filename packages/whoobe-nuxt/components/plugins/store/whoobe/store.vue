<template>
    <div class="w-full" v-if="settings && products" id="whoobestore" ref="whoobestore" :data-scroll="lazyscroll">
        
        <!-- cart -->
        <div class="grid grid-cols-2 gap-2 mb-4">
            <div class="hidden md:flex flex-row items-center justify-start">
                <icon class="mr-2" v-if="!current && !settings.loop.slider" name="grid_on" @click="list=false" title="Grid view"/>
                <icon v-if="!current && !settings.loop.slider" name="list" @click="list=true" title="List view"/>
            </div>
            <div v-if="settings.general.display.cart.enabled" class="hidden w-full text-xs md:flex flex-row items-center justify-end snipcart-checkout cursor-pointer" :class="settings.general.display.cart.css">
                <span class="snipcart-items-count"></span>
                <icon  :name="settings.general.display.cart.name||'mi:shooping_bag'" css="text-2xl"/>
                <span class="snipcart-total-price"></span>  
            </div>
        </div>
        
        <!-- main container -->
        <div v-if="products" class="relative" :class="settings.general.css">
        

            <div class="flex flex-col md:flex-row justify-start w-full items-center relative">

                <!-- categories md: -->                
                <div v-if="isLoop" class="w-full md:w-5/6 hidden md:flex" >
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
                            :sort="sort"
                            @sort="qrySortBy"
                            @range="setPriceRange" 
                            @search="qrySearch"/>
                    </div>
                </transition>
            </div>

            

            <!-- PRODUCTS LIST -->
            
            <div v-if="isLoop" class="flex flex-col md:grid" :class="settings.general.sidebar ? 'md:grid-cols-12':'md:grid-cols-1'">

                <!-- sidebar md: -->
                <div v-if="settings.general.sidebar && !current" class="hidden md:flex flex-col md:col-span-3 xl:col-span-2 whoobe-store-sidebar">
                    <!-- <div v-if="!products.length"><h3>No products found!</h3></div> -->
                    

                    <div v-if="settings.general.display.total.enabled" :class="settings.general.display.total.css">{{ settings.general.display.total.name }} {{total}}</div>
                    <store-categories 
                        :sidebar="true" 
                        :category="$route.params.slug" 
                        :facet="$route.params.facet"
                        :facets="settings.general.display.categories.facets"  
                        v-if="settings.general.display.categories.enabled" 
                        :container="settings.general.display.categories.container" 
                        :css="settings.general.display.categories.css" 
                        @category="qryByCategory" 
                        @facet="qryByFacet"/>
                    
                    <store-filter 
                        v-if="settings.general.display.filter.enabled"
                        :settings="settings" 
                        :sort="sort"
                        @sort="qrySortBy"
                        @range="setPriceRange" 
                        @search="qrySearch"
                        @reset="qry"/>
                </div>

                <!-- products loop -->
                
                <div v-if="!list" whoobe-store-loop-container class="flex flex-col whoobe-store-loop relative" :class="loopContainerClasse" id="productsList">
                    
                    <template v-for="(product,index) in products" v-if="isLoop">
                        <nuxt-link :to="'/store/product/' + product.slug" v-if="index>=start&&index<(start+limit)" >
                        
                            <!-- <transition name="fade"> -->
                                <div :key="product._id" class="transition-all duration-700 linear flex flex-col" :class="productsClasse">

                                    <template v-for="field in settings.loop.fields">
                                        
                                        <div class="truncate ..." :class="field.css" v-if="schema[field.name].type!='image_uri' && field.name !='add_to_cart' && field.name!='description'" :title="product.name">
                                            <small class="mr-1" v-if="schema[field.name].type==='currency'">{{ settings.general.display.currency.symbol }}</small>
                                            {{ schema[field.name].type==='currency' ? parseFloat(product[field.name]).toFixed(2) : product[field.name] }}
                                        </div>
                                        <div v-else>
                                            <div :class="field.css" v-if="field.name==='description'" v-html="product.description"/>
                                            <img :src="$imageURL(product[field.name][0])" :class="field.css" v-if="schema[field.name].type==='image_uri' && field.name != 'add_to_cart'" :title="product.name" :alt="product.name"/>
                                            <button v-if="field.name==='add_to_cart'" :class="field.css">Add to cart</button>
                                        </div>
                                    </template>
                                </div>
                            <!-- </transition> -->
                        </nuxt-link>
                    </template>

                    
                    
                    <!-- PAGINATION -->
                    <store-pagination 
                             v-if="!list && isLoop && settings.general.display.pagination.enabled && pages > 1 && !current"
                            class="hidden md:flex"
                            :pages="pages"
                            :start="start" 
                            :limit="limit" 
                            :settings="settings" 
                            @page="setPage"/>

                    <store-slider 
                        v-if="isLoop && settings.loop.slider && pages > 1"
                        :pages="pages"
                        :start="start"
                        :limit="limit"
                        :max="max"
                        :settings="settings"
                        @cursor="setCursor"/>

                    
                </div>
                <div v-if="list" whoobe-store-loop-container-list class="flex flex-col relative w-full" id="productList" :class="loopContainerClasse">
                    <template v-for="(product,index) in products" v-if="isLoop">
                        <div class="flex flex-col w-full md:mx-5 my-5" v-if="index>=start&&index<(start+limit)" >
                            <nuxt-link :to="'/store/product/' + product.slug">
                                <div class="grid grid-cols-7 gap-2 w-full justify-start">
                                    <div class="col-span-2 md:col-span-1">
                                        <img :src="$imageURL(product.assets[0])" class="w-32 h-32 object-cover"/>
                                    </div>
                                    <div class="col-span-3 md:col-span-4 flex flex-col md:mx-5">
                                        <div :class="fieldClasse('category')"><small>{{ product.category }}</small></div>
                                        <div :class="fieldClasse('name')">{{ product.name }}</div>
                                        <div class="truncate ..."><small>{{ product.description }}</small></div>
                                    </div>
                                    <div class="col-span-2 text-right  flex flex-row items-center justify-end" :class="fieldClasse('price')">
                                        <small class="mr-1">
                                            {{ settings.general.display.currency.symbol }}
                                        </small>
                                        {{ parseFloat(product.price).toFixed(2) }}
                                    </div>
                                </div>
                            </nuxt-link>
                        </div>
                    </template>
                     <!-- PAGINATION -->
                    <store-pagination 
                        v-if="list && isLoop && settings.general.display.pagination.enabled && pages > 1 && !current"
                        :pages="pages"
                        :start="start" 
                        :limit="limit" 
                        :settings="settings" 
                        @page="setPage"/>
                </div>
            </div>

            <!-- desktop single view -->
            <!-- single view is displayed in the products loop container -->
            <transition name="fade">
                <div v-if="current" class="w-full top-0 left-0">
                    <div class="flex items-center h-12 w-full text-left z-highest text-base ml-2 whoobe-single-back-desktop cursor-pointer">
                        <span><icon name="chevron_left" css="text-4xl mr-2" @click="$router.back()"/></span>
                        <nuxt-link :to="'/store/category/' + $slugify(current.category)">
                            <span>{{ current.category }}</span>
                            <span v-if="current.facet"> - {{ current.facet }}</span>
                        </nuxt-link>
                    </div>
                    <div single-desktop v-if="current" :class="singleClasseMD">
                        
                        <div v-for="n in settings.single.cols" class="flex flex-col items-start">    

                            <template v-for="field in settings.single.fields">
                                <span v-if="schema[field.name] && parseInt(field.col)===(n-1)">
                                    <div v-if="field.name==='sku'">
                                        <span v-if="field.name!='sku'">{{ current[field.name] }}</span>
                                        <span v-else>SKU : {{ !currentVariation ? current[field.name] : currentVariation.sku }}</span>
                                    </div>
                                    <div :class="field.css" v-if="schema[field.name].type==='text' || schema[field.name].type === 'string' && field.name != 'sku'" v-html="current[field.name]">
                                    </div>
                                    <div :class="field.css" v-if="schema[field.name].type==='list' && field.name != 'optionValues'">
                                        {{ current[field.name].split ( schema[field.name].separator ).join('-') }}
                                    </div>
                                    <div v-if="field.name === 'optionValues'" class="flex flex-col">
                                        
                                        <div class="relative flex flex-col md:flex-row md:flex-wrap" v-if="productVariations && productVariations.length">
                                            <div :class="variationSelected(current.optionValues,field.css)" @click="currentPrice=current.price,currentOption=current.optionValues,currentVariation=null">{{ current[field.name] }}</div>
                                            <div v-for="variation in productVariations" :class="variationSelected(variation.optionValues,field.css)" @click="currentPrice = variation.price,currentOption=variation.optionValues,currentVariation=variation">
                                                {{ variation.optionValues }}
                                            </div>
                                        </div>
                                        <div v-else>{{current.optionValues}}</div>
                                    </div>
                                    <div :class="field.css" v-if="schema[field.name].type==='currency'">
                                        <small class="mr-1">{{ settings.general.display.currency.symbol }}</small>
                                        <span>{{ parseFloat(currentPrice).toFixed(2) }}</span>
                                    </div>
                                    <div :class="field.css" v-if="field.name==='category'">
                                        {{ current[field.name] }}
                                    </div>
                                    <div :class="field.css" v-if="field.name==='facets'">
                                        {{ current[field.name].join(' - ') }}
                                    </div>
                                    <div v-if="schema[field.name].type==='image_uri'" class="flex flex-col"> 
                                        <img :src="$imageURL(current[field.name][currentImageIndex])" :class="field.css"/>
                                        <div class="flex flex-row flex-wrap" v-if="current.assets.length > 1">
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
                                        :key="field.name"
                                        :class="field.css"
                                        :data-item-quantity="qty"
                                        :data-item-id="current._id"
                                        :data-item-image="$imageURL(current.assets[0])"
                                        :data-item-price="currentPrice"
                                        :data-item-name="current.name + ' ' + currentOption"
                                        :data-item-description="currentOption"
                                        :data-item-url="'/store/products/' + current._id"> 
                                    Add to cart</button>
                                </div>
                            </template>
                            
                        </div>
                    </div>
                </div>
                
            </transition>
            
            <!--- related products --->
            
            
        </div>
        <store-related
                    v-if="current && current.hasOwnProperty('upsell') && current.upsell && settings.single.related"
                    :classe="loopContainerClasse"
                    :schema="schema"
                    :settings="settings"
                    :current="current"/>
        <!-- navigation bar responsive only -->
        <div v-if="settings.general.display.navigation.enabled" :class="settings.general.display.navigation.css" class="md:hidden z-modal cursor-pointer bottom-0">

            <icon v-if="settings.general.display.navigation.home" label="Home" name="home" @click="$router.push('/')" :css="settings.general.display.navigation.icons_css"/>        

            <icon v-if="settings.general.display.categories.enabled" label="Categories" name="category" @click="categories=!categories" :css="settings.general.display.navigation.icons_css"/>    
    
            <icon v-if="settings.general.display.search && isLoop" label="Filter" name="search" @click="advancedFilter=!advancedFilter" :css="settings.general.display.navigation.icons_css"/>

            <icon v-if="!current && settings.general.display.categories.enabled" label="View" :name="list?'grid_on':'list'" @click="list=!list" :css="settings.general.display.navigation.icons_css"/>

            <span v-if="settings.general.display.cart" class="snipcart-checkout">
                <icon :name="settings.general.display.cart.name || 'shooping_bag'" label="Cart" :css="settings.general.display.navigation.icons_css"/>
            </span>
        </div>
        
    </div>

</template>

<script>
import model from './model.js'
export default {
    name: 'WhoobeStore',
    components: {
        'store-categories'  : () => import ( './store.categories.vue' ),
        'store-filter'      : () => import ( './store.filter.vue'),
        'store-pagination'  : () => import ( './store.pagination.vue' ),
        'store-slider'      : () => import ( './store.slider.vue' ),
        'store-related'     : () => import ( './store.related.vue' ),
        'double-range'      : () => import ( '@/components/common/double.range.vue'),
        //'snipcart'          : () => import ( '@/components/plugins/store/whoobe/store.vue')
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
        limit: 12,
        total: 0,
        list: false,
        search:'',
        advancedFilter: false,
        group: '',
        categories: false,
        current: null,
        qty:1,
        allProducts: null,
        products: null,
        productVariations: null,
        currentPrice:null,
        currentOption: 0,
        currentVariation: 0,
        currentImageIndex:0,
        settings: null,
        customize: false,
        schema: null,
        filter: null,
        sortBy: '',
        priceRange: {
            min: 0,
            max: 3000
        },
        category: '',
        facet: '',
        sort: '',
        qryPrice: false,
        qryFacet: false,
        qryRoute: false,
        qryIds: '',
        seo_title: '',
        seo_description: ''
    }),
    async asyncData({app,route}){
        const query = await app.$whoobe.service ( 'products' ).find ( {
          query : {
              $limit: 200,
              type: 'product',
              active: true
          }
        })
        return { 
            allProducts : query
        }
    },
    computed:{
        isLoop(){
            return !this.$route.path.includes('store/product/')
        },
        productsClasse(){
            return !this.current ?
                this.settings.loop.css : 'hidden' 
        },
        loopContainerClasse(){
            
            return !this.isLoop ?
                    'md:col-span-12 ' + this.settings.loop.container :
                        this.settings.general.sidebar ?
                            'md:col-span-9 xl:col-span-10 ' + this.settings.loop.container :
                                'md:col-span-12 ' + this.settings.loop.container

        },
        singleClasse(){
            return 'fixed z-modal overflow-y-auto inset-0 md:modal min-h-screen w-screen ' + this.settings.single.css + ' ' + this.settings.single.container
        },
        singleClasseMD(){
            return this.settings.single.css + ' ' + this.settings.single.container
        },
        
        
        max(){
            return parseInt(this.$attrs.plugin.settings.loop.records.max)
        },
        pages(){
            let p = parseInt(( this.products.length / this.limit ))
            
            p * this.limit < this.total ?
                p++ : null 
            return p
        },
        seoTitle(){
            return this.current ?
                this.seo_title = this.current.seo_title : this.seo_title = this.$attrs.plugin.general.name
        },
        seoDescription(){
            return this.current ?
                this.seo_description = this.current.seo_description : this.seo_description = this.$attrs.plugin.general.description
        },
        lazyscroll(){
            if ( process.client && this.products && !this.current ){

                    if ( window.innerWidth < 480 ){
                        document.addEventListener('scroll',()=>{
                            var element = document.querySelector('#whoobestore')
                            //console.log ( element )
                            var coords = element.getBoundingClientRect()
                            if ( parseInt(coords.height) < ( window.innerHeight + window.pageYOffset ) ){
                                this.limit += this.limit
                            }
                            //console.log ( parseInt(coords.height ) ,  window.innerHeight , window.pageYOffset )
                        })
                    }
            }
        }
    },
    watch:{
        start(){
            this.scrollTop()
            //this.qry()
            // this.qryPrice ?
            //     this.qryByPrice() :
            //         this.search ? 
            //             this.qrySearch(null) :
            //                 this.filter ?
            //                     this.filter.field === 'category' ?
            //                         this.qryByCategory ( this.filter.value , true ) : 
            //                             this.qry() : this.qry()
        },
        
        current(v){
            if ( v && !this.$route.query.product ){
                //var element = document.querySelector("#store_single");
                // scroll to element
                //element.scrollIntoView();
                this.scrollTop()
                window.sessionStorage.setItem('moka-product-view',JSON.stringify(v))
            }
        },

        sortBy(val){
            this.qry()
            // this.advancedFilter = false
            // if ( val ){
            //     if ( val === 'priceASC' ){
            //         this.products = this.products.sort ( (a,b) => a.price_value - b.price_value )
            //     }
            //     if ( val === 'priceDESC' ){
            //         this.products = this.products.sort ( (a,b) => b.price_value - a.price_value )
            //     }
            // }
        }
    },
    methods:{
        setPage(n){
            this.start = n
        },
        setCursor(n){
            if (  parseInt(n) < this.max  && (parseInt(n)+parseInt(this.limit)) <= this.total ){
                this.start = n
            } else {
                this.start = parseInt(n) - parseInt(this.limit)
            }
        },
        hasImage (image){
            if ( image && image.url ){
                image.url.replace ( process.env.API_URL , '/' )
                console.log ( 'Process => ' , process.env.NODE_ENV )
                if ( process.client ){
                    console.log ( process.env.prod )
                    return process.env.MODE === 'development' ?
                        this.process.API_URL + this.$imageURL(image) :
                            this.$imageURL(image) 
                }
            }
            return ''
        },
        setPriceRange(min,max){
            this.advancedFilter =! this.advancedFilter
            this.priceRange = {
                min: min,
                max: max
            }
            this.qryPrice = true
            this.qryByPrice()
        },
        productImage ( asset ){
            this.$imageURL(asset[0]) 
        },
        variationSelected(variation,css){
            return variation === this.currentOption ?
                css + ' bg-black text-white' : css
        },
        variations(sku){
            if ( this.current )
                this.productVariations = this.$store.state.product_variations.data.filter ( variation => {
                    return variation.parent === this.current.sku
                })
        },
        qry(){
            this.advancedFilter = false
            this.current = null
            this.start = 0
            let qry = {
                $limit : this.limit ,
                $skip  : this.start,
                type   : 'product'
            }
            let qryProducts = this.allProducts
            if ( this.qryIds.length ){
                //qryProducts = []
                qryProducts = []
                this.max = this.qryIds.length
                this.qryIds.forEach ( name => {
                    qryProducts.push ( this.allProducts.filter ( product  => product.name === name )[0] )
                })
            }
            if ( this.qryPrice ){
                qry['$and'] = [ 
                    { price_value : { $gte: this.priceRange.min }} , 
                    { price_value : { $lte: this.priceRange.max }} , 
                ]
                qryProducts = qryProducts.filter ( product => product.price_value >= this.priceRange.min && product.price_value <= this.priceRange.max )
            }
            if ( this.category ){
                let cat = this.$store.state.categories.filter ( ct => ct.slug === this.category )[0]
                this.seo_title = this.category.name
                this.seo_description = this.category.name
                if ( cat )
                    qryProducts = qryProducts.filter ( product => product.category.includes ( cat.name ) )
            }
            if ( this.facet ){
                let fac = this.$store.state.categories.filter ( ct => ct.slug === this.facet )[0]
                if ( fac )
                    qryProducts = qryProducts.filter ( product => product.facets.includes ( fac.name ) )
            }
            
            if ( this.sort ){
                this.sort === 'priceASC' ?
                    qryProducts = qryProducts.sort ( (a,b) => a.price_value - b.price_value ) :        
                        qryProducts = qryProducts.sort ( (a,b) => b.price_value - a.price_value )
            }
            if ( this.search ){
                console.log ( 'searching products => ' , this.search )
                qryProducts = qryProducts.filter ( product => {
                    return product.name.toLowerCase().includes(this.search) || product.category.toLowerCase().includes(this.search) || ( product.description && product.description.toLowerCase().includes(this.search))
                })
            }
            this.products = qryProducts
            this.total = this.products.length    
            
            if ( !this.qryRoute && this.$route.query.product ){
                this.current = this.allProducts.filter ( product => {
                    return product.slug === this.$route.query.product
                })[0]
                this.variations ( this.current.sku )  
                this.currentPrice = this.current.price
                this.currentVariation = this.current.optionValues
                this.qryRoute = true
            } else {
                this.current = null
            }

            if ( !this.qryRoute && this.$route.params.slug && this.$route.path.includes('store/product/') ){
                this.current = this.allProducts.filter ( product => {
                    return product.slug === this.$route.params.slug
                })[0]
                this.variations ( this.current.sku )  
                this.currentPrice = this.current.price
                this.currentOption = this.current.optionValues
                this.qryRoute = true
            } else {
                this.current = null
            }
        
        },
        qryByCategory ( category , skip ){
            //this.scrollTop()
            this.facet = ''
            this.categories = false
            this.category = category 
            this.qry()
        },
        qrySortBy(order){
            this.scrollTop()
            this.sort = order 
            this.qry()
        },
        qrySearch(search){
            this.search = search
            this.scrollTop()
            this.qry()
        },
        qryByPrice(){
            this.scrollTop()
            this.advancedFilter = false
            this.products = this.allProducts.filter ( product => {
                return product.price_value >= this.priceRange.min && product.price_value <= this.priceRange.max
            }).sort ( (a,b) => a.price_value - b.price_value )
            this.total = this.products.length
            
        },
        qryByFacet ( facet , skip ){
            this.categories = false
            this.category = ''
            this.facet = facet
            this.qry()
        },
        randomImage(name){
            return 'https://source.unsplash.com/600x400?fashion&' + name
        },
        scrollTop(){
            // element which needs to be scrolled to
            var element = document.querySelector("#whoobestore");
            // scroll to element
            //if (  !this.qryRoute )
            if ( !this.current )
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
        productSearchMobile(){
            this.start = 0
            this.qrySearch()
        },
        activePage(page){
            if ( (page-1) * this.limit === this.start ){
                return 'animate-pulse'
            }
        },
        fieldClasse(field){
            return this.settings.single.fields.filter ( a => a.name === field )[0].css
        },
    },
   
    mounted(){
        this.allProducts = this.$store.state.shop.data
        this.total = this.allProducts.length
        this.lang = this.language[navigator.language||'en']
        !this.lang ? this.lang = this.language['en'] : null
        this.settings = this.$attrs.plugin.settings
        this.schema = model
        this.settings.loop.ids ?
            this.qryIds = this.settings.loop.records.ids.split(',') : null
        this.limit = parseInt(this.$attrs.plugin.settings.loop.records.limit)

        if ( !this.$route.path.includes('/store/product') ){
            if ( this.$route.params.hasOwnProperty('slug') && !this.$route.params.hasOwnProperty('facet')){
                if ( this.$route.params.slug ){
                     
                    this.qryByCategory(this.$route.params.slug)
                }
            }
            if ( this.$route.params.hasOwnProperty('facet')){
                this.qryByFacet(this.$route.params.facet)
            }
        }
        this.qry()
        

        
    },
    head(){
        if ( this.current && !this.$attrs.plugin.settings.loop.slider ){
            return {
                title: this.$store.state.seo_title + ' - ' + this.current.name , 
                meta: [
                    // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                    { 
                        hid: 'description',
                        name: 'description', 
                        content: this.current.seo_description 
                    }
                ]
            }
        }
    },
}
</script>

<style>

.animateme {
    transition: all .5s linear;
}
</style>