<template>
    <div class="">
    <div class="relative">
        <div class="absolute right-0 top-0 text-xs flex flex-row items-center snipcart-checkout">
            <span class="snipcart-items-count"></span>
            <i class="material-icons">shopping_bag</i>
            <span class="snipcart-total-price"></span>  
        </div>
        <!-- <div v-if="!apikey" class="text-center w-full border-4 bg-gray-300 text-lg text-red-500">Invalid License Key</div> -->
        <h3 id="storeTop">Store</h3>
        <p>{{ lang.products }} {{total}}</p>
        <div class="w-full text-center cursor-pointer">
            <i class="mr-4 bi-chevron-left" @click="start > 0 ? start=start-limit : null"></i>
            <small>{{start+1}}-{{start+limit}}</small>
            <i class="ml-4 bi-chevron-right" @click="(start+limit)<=total?start=start+limit:null"></i>
        </div>
        <div class="flex flex-row flex-wrap items-center justify-center">
        <template v-for="(product,index) in products">
            <div class="flex flex-col w-64 h-64 m-8 shadow-md rounded-md relative border-4 border-gray-200" @click="current=product">
                <img :src="product.image_uri"/>
                <!-- <img :src="randomImage(product.name)" class="w-full rounded-tl rounded-tr"/> -->
                <div class="p-4">
                    <div class="text-sm">{{product.name}}</div>
                    <div>$ {{product.price}}.<small>00</small></div>
                </div>
                <div class="absolute items-center justify-center bg-gray-100 top-0 left-0 right-0 bottom-0 opacity-0 rounded-md bg-opacity-75 hover:opacity-100 animateme flex flex-row justify-between px-12">
                <i class="material-icons snipcart-add-item moka-icon-circle text-2xl"
                    :data-item-id="product.id"
                    :data-item-price="product.price"
                    :data-item-url="'/store/product/' + product.id"
                    :data-item-description="product.name"
                    :data-item-image="product.image_uri"
                    :data-item-name="product.name" :title="lang.add_to_cart">shopping_cart</i>
                <i class="material-icons moka-icon-circle text-2xl" :title="lang.detail" @click="current=product">search</i>
                <button v-if="!product.price" @click="setPrice(product.id,index)">Set price</button>
                </div>
            </div>

        </template>
        </div>
        <div class="w-full text-center cursor-pointer">
            <i class="mr-4 bi-chevron-left" @click="start=start-limit,scrollTop()" v-if="start > 0"></i>
            <small>{{start+1}}-{{start+limit}}</small>
            <i class="ml-4 bi-chevron-right" @click="start=start+limit,scrollTop()" v-if="(start+limit)<=total"></i>
        </div>
        <transition name="animate-slideout">
            <modal
                v-if="current && current.name"
                size="lg"
                position="modal"
                buttons="none"
                @close="current=!null">
                <div slot="title">{{ current.name }}</div>
                <div slot="content">
                    <div class="grid md:grid-cols-3 grid-cols-1">
                    <img :src="current.image_uri" class="md:col-span-2"/>
                    <!-- <img :src="randomImage(product.name)" class="w-full rounded-tl rounded-tr"/> -->
                    <div class="p-4">
                        <div class="text-2xl">{{current.name}}</div>
                        <div class="text-sm text-gray-400">{{current.code}}</div>
                        <div class="text-2xl my-4">$ {{current.price}}.<small>00</small></div>
                        <button class="snipcart-add-item px-2 py-2 success text-2xl"
                            :data-item-id="current.id"
                            :data-item-price="current.price"
                            :data-item-url="'/store/product/' + current.id"
                            :data-item-description="current.name"
                            :data-item-image="current.image_uri"
                            :data-item-name="current.name" :title="lang.add_to_cart">{{lang.buy}}</button>
                    </div>
                    
                    </div>
                </div>
            </modal>
        </transition>
        
    </div>
    </div>
</template>

<script>
import language from './en.js'
import products from './products.json'
//import MokaPreview from '@/components/editor/preview/moka.preview.container'
export default {
    name: 'WhoobeStore',
    data:()=>({
        apikey: false,
        lang: 'en',
        start: 0,
        total: 0,
        current: null,
        products: null
    }),
    props:['editor'],
    computed:{
        limit(){
            return parseInt(this.$attrs.plugin.editor.settings.rows)
        }
    },
    watch:{
        start(){
            this.scrollTop()
            this.$api.service('products').find ( { query : { $limit: this.limit , $skip : this.start }}).then ( result => {
                this.products = result.data
            })
        },
        current(v){
            if ( v ){
                window.sessionStorage.setItem('moka-product-view',JSON.stringify(v))
            }
        }
    },
    methods:{
        randomImage(name){
            return 'https://source.unsplash.com/600x400?fashion&' + name
        },
        scrollTop(){
           // element which needs to be scrolled to
            var element = document.querySelector("#storeTop");

            // scroll to element
            element.scrollIntoView();
        },
    },
    mounted(){
        this.lang = language[navigator.language||'en']
        let whoobe = JSON.parse(window.localStorage.getItem('whoobe'))
        console.log ( this.$attrs.plugin.editor.settings )
        // if ( !whoobe ){
        //     this.$store.dispatch('save',false)
        //     this.$message ( 'Invalid License Key! Save is disabled.' )
        // } else {
        //     this.$api.service('apikeys').find ( { query: { apikey: whoobe.apikey, active: 1 } } ).then ( result => {
        //         if ( result.total ){
        //             this.apikey = true
        //             this.$store.dispatch('save',true)
        //         } else {
        //             this.apikey = false
        //             this.$store.dispatch('save',false)
        //             this.$message ( 'Invalid License Key! Save is disabled.' )
        //         }
        //     })
        // }

        //if ( this.$attrs.config.mode != 'static' ){
            //this.$http.get('products').then ( res => {
            this.$api.service ( 'products' ).find ( { query: { $limit: this.limit , $skip: this.start }} ).then ( res => {
                this.products = res.data 
                console.log ( res )
                this.total = res.total
            })
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