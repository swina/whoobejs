<template>
    <div v-if="products" class="relative">
        <icon :name="current?'collections':'web'" v-if="$attrs.editor" class="z-highest absolute top-0 right-0 text-2xl text-gray-400 cursor-pointer m-2 -mt-3" :title="current?'Loop view':'Single View'" @click="current?current=null:setProduct(products[0],0)"/>
        <!-- <button class="z-highest absolute top-0 right-0" v-if="$attrs.editor" @click="current?current=null:setProduct(products[0],0)">{{ !current?'Single View':'Loop View'}}</button> -->
        <collections @collection="collectionQry" :reload="reload"/>
        <h3>{{ collection }}</h3>
        <div v-if="!current" class="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-5 lg:gap-10" :class="'lg:grid-cols-' + settings.loop.cols">
            <template v-for="(product,index) in products">
                <div class="flex flex-col relative" :class="loopCss" @click="setProduct(product,index)">
                    <!-- <template v-for="field in settings.loop.fields">
                        {{ field.field }} {{ field.css }}
                        <div :class="field.css" v-if="field.field=!'assets'">{{ product[field.field] }}</div>
                        <img v-if="field.field==='assets'" :src="product[0].assets.source" :class="field.css"/>
                    </template> -->
                    <!-- {{ settings.loop.fields }} -->
                    <template v-for="f in settings.loop.fields">
                        <div :class="f.css" v-if="f.field!='assets' && f.field!='price'">{{product[f.field]}}</div>
                        <img :class="f.css" v-if="f.field==='assets'" :src="product.assets[0].source"/>
                        <div :class="f.css" v-if="f.field === 'price'">{{ (product.variants[0].price/100).toFixed(2) }}</div>
                    </template>
                    <!-- <div class="text-xl p-2">{{ product.name }}</div> 
                    <img :src="product.assets[0].source" class="object-cover object-center h-48"/>
                    <div class="text-xl p-2" v-html="price(product)">
                    </div> -->
                </div>
            </template>
            
        </div>
        <navigation
                v-if="!current"
                class="my-8" 
                size="4xl"
                @prev="skip>0?skip=parseInt(skip)-parseInt(limit):null" 
                @next="skip=parseInt(skip)+parseInt(limit)"/>
        
        
        <div v-if="current" :class="loopCss" class="relative flex flex-col p-2 w-full md:w-11/12 lg:w-5/6 m-auto transition-all duration-500 ease-in-out" :key="current.id">
            <icon class="absolute right-0 top-0 m-2 text-3xl hover:bg-black hover:text-white" name="close" @click="current=null"/>
            <div class="flex flex-col gap-5 md:grid" :class="'grid-cols-' + settings.single.layout_cols">
                <template v-for="n in settings.single.layout_cols">
                    <div class="flex flex-col">
                        <template v-for="f in settings.single.fields">
                            <div v-if="parseInt(f.col)===(n-1)">
                                <img :class="f.css" v-if="f.field==='assets'" :src="current.assets[0].source"/>
                                <div :class="f.css" v-if="f.field != 'variants' && f.field!='assets' && f.field!='price' && f.field!='add_to_cart'">{{current[f.field]}}</div>
                                <div :class="f.css" v-if="f.field === 'price'" v-html="price(current,currentPrice)"></div>
                                <div v-if="f.field==='variants' && current.variants.length > 1" class="flex flex-col md:flex-row" :class="f.css">
                                    <template v-for="variant in current.variants">
                                        <div class="border p-2 w-48 text-base mr-2 cursor-pointer transition-all duration-500 ease-in-out" :class="currentPrice===variant?'bg-black text-white':''" @click="currentPrice=variant">{{ variant.name }}</div>
                                    </template>
                                </div> 
                                <button 
                                    v-if="f.field==='add_to_cart'"
                                    :data-item-id="current.id"
                                    :data-item-name="currentPrice.name"
                                    :data-item-price="itemprice(current,currentPrice)"
                                    :data-item-url="'/store/products/' + current.id"
                                    :data-item-image="current.assets[0].source"
                                    :data-item-description="current.description"
                                    class="snipcart-add-item text-xl my-4 p-2">Buy</button>
                            </div>
                        </template>
                    </div>
                </template>

            </div>
            <!---
            <div class="flex flex-col md:grid md:grid-cols-2  gap-5">
                <div class="flex flex-col">
                    <img :src="current.assets[0].source" class="object-cover object-center w-full h-56 md:h-auto lg:h-auto"/>
                    <template v-for="asset in current.assets" v-if="current.assets.length > 1">
                        <img :src="asset.source" class="mt-2 w-16 h-12 object-fit mr-2"/>
                    </template>
                </div>
                <div class="flex flex-col">
                    <h2>{{ current.name }}</h2>
                    <div class="flex flex-col md:flex-row my-4" v-if="current.variants.length > 1">
                    <template v-for="variant in current.variants">
                        <div class="border p-2 w-48 text-base mr-2 cursor-pointer transition-all duration-500 ease-in-out" :class="currentPrice===variant?'bg-black text-white':''" @click="currentPrice=variant">{{ variant.name }}</div>
                        
                    </template>
                    </div>
                    
                    <div class="flex flex-col">
                        <div class="text-3xl" v-html="price(current,currentPrice)"></div>
                        <button 
                            :data-item-id="current.id"
                            :data-item-name="currentPrice.name"
                            :data-item-price="itemprice(current,currentPrice)"
                            :data-item-url="'/store/products/' + current.id"
                            :data-item-image="current.assets[0].source"
                            :data-item-description="current.description"
                        class="snipcart-add-item text-xl my-4 p-2">Buy</button>
                    </div>
                </div>

            </div>-->
            <!--<div class="text-sm font-bold mt-4">Description</div>
            <div class="text-lg px-4 md:px-10" v-html="current.description"></div>-->
            <navigation 
                class="m-auto mt-10"
                size="4xl"
                @prev="index>0?index--:null" 
                @next="index++"/>
        </div>
        
    </div>
</template>

<script>
import queries from './queries'
import jp from 'jsonpath'
export default {
    name: 'VendureMain',
    components: {
        'collections' : () => import ( './collections.vue' )
    },
    data:()=>({
        collection: null,
        products:null,
        current: null,
        currentPrice:null,
        descVisible: false,
        index:0,
        //limit: 8,
        skip:0,
        gql: '',
        settings: null,
        reload: false
    }),
    computed:{
        limit(){
            return parseInt(this.settings.general.limit)
        },
        loopCss(){
            return this.$attrs.plugin.component.settings.loop.box_css
        }
    },
    watch:{
        skip(v){
            this.qry()
        },
        index(i){
            this.setProduct ( this.products[i] , i)
        },
    },
    methods:{
        qry(){
            this.$loading ( true )
            let options = "query Products { products ( options : { skip: " + parseInt(this.skip) + " take: " + this.limit + "}) {" + this.gql + "}}"
            console.log ( options )
            fetch('http://localhost:3000/shop-api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: options })// 'query Products { products { items { name } } }' }),
                })  
                .then(response => response.json())
                .then( data => {
                    console.log ( data.data.products.items )
                    this.products = data.data.products.items
                    this.$loading()
            })
        },
        collectionQry(name){
            this.current = null
            this.reload = true
            this.collection = name
            let query = queries.collection
            query = query.replace ( '__filter__' , '\"' + name + '\"' )
            console.log ( query )
            this.$loading ( true )
            fetch('http://localhost:3000/shop-api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query })// 'query Products { products { items { name } } }' }),
                })  
                .then(response => response.json())
                .then( data => {
                    let products = jp.query ( data.data.collections.items[0], '$..product' )
                    this.products = [...new Map(products.map(item => [item['id'], item])).values()]
                    this.$loading()
                    this.reload = false
            })
        },
        setProduct(product,index){
            this.index = index
            this.current = product
            this.currentPrice = product.variants[0]
        },
        price ( product , price ){
            let discount = { value: 1 , label : '' }
            product.facetValues.forEach ( facet => {
                facet.code.includes('20-off') ? discount = { value: 0.8 , label: facet.name } : null
            })
            //let variants = product.variants.length > 1 ? '<small>from ' : '<small>'
            if ( !price ){
                return '<small>' + product.variants[0].currencyCode + '</small> ' + ((product.variants[0].price/100) * discount.value).toFixed(2) + '<div class="absolute top-0 right-0 text-xs bg-red-500 text-white">' + discount.label + '</div>'
            } else {
                return '<small>' + price.currencyCode + '</small> ' + ((price.price/100) * discount.value ).toFixed(2)
            }
        },
        itemprice(product,price){
            let discount = { value: 1 , label : '' }
            product.facetValues.forEach ( facet => {
                facet.code.includes('20-off') ? discount = { value: 0.8 , label: facet.name } : null
            })
            if ( !price ){
                return ((product.variants[0].price/100) * discount.value).toFixed(2)
            } else {
                return ((price.price/100) * discount.value ).toFixed(2)
            }
        }
    },
    mounted(){  
        fetch('http://localhost:3000/shop-api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: 'query Products { products { totalItems } }' }),
        })  
            .then(response => response.json())
            .then( data => {
            this.total = data.data.products.totalItems 
        })
        
        this.settings = Object.assign({},this.$attrs.plugin.component.settings)
        this.gql = queries.products
        this.qry()
    }
}
</script>