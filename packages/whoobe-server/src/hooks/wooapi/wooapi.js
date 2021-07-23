//const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const { connection } = require("@feathersjs/authentication/lib/hooks")

   
module.exports = (options = {}) => {
    return async context => {
        // const api = new WooCommerceRestApi(
        //     context.app.get('woocommerce')
        // )
        context.app.service ( 'build-nuxt' ).find()
            .then ( res => {
                console.log ( res )
                const slugs = res.data[0].pagesToPublish
                context.app.service ( 'articles' ).find (
                    {
                        query: {
                            slug : { $in : slugs }
                        }
                    }
                ).then ( result => {
                    console.log ( result )
                    context.result = result
                })
                return context
            }).catch ( error => {
                console.log ( error )
            })
    }
}