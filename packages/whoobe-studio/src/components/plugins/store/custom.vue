<template>
    <div class="relative">
        <div class="absolute right-0 top-0 text-xs flex flex-row items-center snipcart-checkout">
            <span class="snipcart-items-count"></span>
            <i class="material-icons">shopping_bag</i>
            <span class="snipcart-total-price"></span>  
        </div>
        <h3 id="storeTop">Store</h3>
        <p>Prodotti {{total}}</p>
        <div class="w-full text-center cursor-pointer">
            <i class="mr-4 bi-chevron-left" @click="start=start-limit" v-if="start > 0"></i>
            <small>{{start+1}}-{{start+limit}} di {{ total }}</small>
            <i class="ml-4 bi-chevron-right" @click="start=start+limit" v-if="(start+limit)<=total"></i>
        </div>
        <div class="flex flex-row flex-wrap items-center justify-center">
        <template v-for="(product,index) in products">
            <div class="flex flex-col w-64 h-64 m-8 shadow-md rounded-md relative border-4 border-gray-200">
                <img :src="product.image_uri"/>
                <!-- <img :src="randomImage(product.name)" class="w-full rounded-tl rounded-tr"/> -->
                <div class="p-4">
                    <div class="text-sm">{{product.name}}</div>
                    <div>$ {{product.price}}.<small>00</small></div>
                </div>
                <div class="absolute items-center justify-center bg-gray-100 top-0 left-0 right-0 bottom-0 opacity-0 rounded-md bg-opacity-75 hover:opacity-100 animateme flex flex-row justify-between px-12">
                <i class="material-icons snipcart-add-item moka-icon-circle text-2xl"
                    :data-item-id="product.code"
                    :data-item-price="product.price"
                    :data-item-url="'/product/' + product.code"
                    :data-item-description="product.name"
                    :data-item-image="product.image_uri"
                    :data-item-name="product.name" title="add to cart">shopping_cart</i>
                <i class="material-icons moka-icon-circle text-2xl" title="See more" @click="current=product">search</i>
                <button v-if="!product.price" @click="setPrice(product.id,index)">Set price</button>
                </div>
            </div>

        </template>
        </div>
        <div class="w-full text-center cursor-pointer">
            <i class="mr-4 bi-chevron-left" @click="start=start-limit,scrollTop()" v-if="start > 0"></i>
            <small>{{start+1}}-{{start+limit}} di {{ total }}</small>
            <i class="ml-4 bi-chevron-right" @click="start=start+limit,scrollTop()" v-if="(start+limit)<=total"></i>
        </div>
        <transition name="animate-slideout">
            <moka-modal
                v-if="current && current.name"
                size="lg"
                buttons="none"
                @close="current=!null">
                <div slot="title">{{ current.name }}</div>
                <div slot="content">
                    <div class="grid grid-cols-3">
                    <img :src="current.image_uri" class="col-span-2"/>
                    <!-- <img :src="randomImage(product.name)" class="w-full rounded-tl rounded-tr"/> -->
                    <div class="p-4">
                        <div class="text-2xl">{{current.name}}</div>
                        <div class="text-sm text-gray-400">{{current.code}}</div>
                        <div class="text-2xl my-4">$ {{current.price}}.<small>00</small></div>
                        <button class="snipcart-add-item px-2 py-2 success text-2xl"
                    :data-item-id="current.code"
                    :data-item-price="current.price"
                    :data-item-url="'/product/' + current.code"
                    :data-item-description="current.name"
                    :data-item-image="current.image_uri"
                    :data-item-name="current.name" title="add to cart">Acquista</button>
                    </div>
                    
                    </div>
                </div>
            </moka-modal>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'NuxpressoProducts',
    data:()=>({
        start: 0,
        total: 0,
        current: null
    }),
    computed:{
        limit(){
            return parseInt(this.$attrs.el.plugin.config.rows)
        }
    },
    watch:{
        start(){
            this.scrollTop()
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
        setPrice(id,i){
            let price = { price : Number(Math.round(Math.random() * (80 - 40 + 1) + 40),2)+'.00' }
            this.$http.put ( 'products/' + id , price ).then(res=>{
                this.products[i].price = price 
                console.log ( res)
            })
        },
        deleteThis(id,i){
            this.$http.delete ( 'products/' + id ).then ( res => {
                this.products.splice(i,1)
                console.log ( res )
            })
        }
    },
    mounted(){
        
        this.$http.get('products/count').then ( res => {
            this.total = res.data
        })
        this.$http.get('products').then ( res => {
            console.log ( res )
        })
    }
}
</script>

<style>

.animateme {
    transition: all .5s linear;
}
</style>