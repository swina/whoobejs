<template>
    <button 
        v-if="product"
        :class="$attrs.css"
        :data-item-id="product.id"
        :data-item-price="product.price"
        :data-item-url="'/store/product/' + product.id"
        :data-item-image="$imageURL(product.image)"
        :data-item-name="product.name"
        :data-item-description="product.description"
        >BUY</button>
</template>

<script>
export default {
    name: 'SnipcartAddToCart',
    props: [ 'product' ]
}
</script>