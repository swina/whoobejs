<template>
    <div whoobe-store-related v-if="products.length" class="grid grid-cols-12 col-span-2">
    <h3 class="m-auto text-center store-related-title col-span-12">Related</h3>
    <div whoobe-store-related-container class="flex flex-col whoobe-store-related relative" :class="$attrs.classe.replace('border','')" id="productRelated">
                    
        <template v-for="(product,index) in products">
            <nuxt-link :to="'/store/product/' + product.slug" v-if="index>=start&&index<(start+limit)" >
            
                <!-- <transition name="fade"> -->
                    <div :key="product._id" class="transition-all duration-700 linear flex flex-col" :class="settings.loop.css">

                        <template v-for="field in settings.loop.fields">
                            
                            <div class="truncate ..." :class="field.css" v-if="schema[field.name].type!='image_uri' && field.name !='add_to_cart' && field.name!='description'" :title="product.name">
                                <small class="mr-1" v-if="schema[field.name].type==='currency'">{{ settings.general.display.currency.symbol }}</small>
                                {{ schema[field.name].type==='currency' ? parseFloat(product[field.name]).toFixed(2) : product[field.name] }}
                            </div>
                            <div v-else>
                                <div :class="field.css" v-if="field.name==='description'" v-html="product.description"/>
                                <img :src="$imageURL(product[field.name][0])" :class="field.css" v-if="schema[field.name].type==='image_uri' && field.name != 'add_to_cart'" :title="product.name" :alt="product.name">
                                <button v-if="field.name==='add_to_cart'" :class="field.css">Add to cart</button>
                            </div>
                        </template>
                    </div>
                <!-- </transition> -->
            </nuxt-link>
        </template>
    </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeStoreRelated',
    data:()=>({
        products: [],
        start: 0,
        limit: 9999,
        max:9999
    }),
    props: ['settings','schema','current'],
    mounted(){
        console.log ( this.$store.state.shop.data )
        this.products = this.$store.state.shop.data.filter ( product => 
            this.current.upsell.includes ( product.slug ) 
        )
    }
}
</script>