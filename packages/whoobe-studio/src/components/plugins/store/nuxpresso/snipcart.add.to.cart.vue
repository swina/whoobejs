<template>
    <button 
        v-if="product"
        :class="el.css + ' snipcart-add-item'" :style="el.style"
        :data-item-id="product.id"
        :data-item-price="product.price"
        :data-item-url="'/store/product/' + product.id"
        :data-item-description="product.name"
        :data-item-image="product.image_uri"
        :data-item-name="product.name" :title="lang.add_to_cart"
        >
        {{ el.content }}
    </button>
</template>

<script>

import language from './en.js'
export default {
    name: 'MokaSCAddToCart',
    data:()=>({
        lang: 'en',
        product: null
    }),
    props:['el'],
    mounted(){
        this.product = this.$attrs.attrib.data
        this.lang = language[navigator.language||'en']
        language.hasOwnProperty( navigator.language.split('-')[0] ) ?
            this.lang = language[navigator.language.split('-')[0]] : 
                this.lang = 'en'

    }
}
</script>