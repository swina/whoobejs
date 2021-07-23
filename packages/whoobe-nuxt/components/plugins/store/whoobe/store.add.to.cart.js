import Vue from 'vue'

export default {
    install: function (Vue) {

        Vue.prototype.$add_to_cart = (product) => {
            if ( product ) return false
                let attributes = {
                    'data-item-id'      : product._id ,
                    'data-item-price'   : product.sale ? product.sale : product.price,
                    'data-item-url'     : '/store/product/' + product._id,
                    'data-item-image'   : product.image,
                    'data-item-name'    : product.name,
                    'data-item-description' : product.description ? product.description : product.name,

            }
        }
    }
}