<template>
  <div v-if="cart && apiKey" id="snipcart" data-config-modal-style="side" :data-api-key="apiKey"></div>
</template>

<script>

function injectScript() {
  let target = document.querySelector('body')
  const snipcartCSS = document.createElement('link')
  snipcartCSS.setAttribute('rel','stylesheet')
  snipcartCSS.setAttribute('href','https://cdn.snipcart.com/themes/v3.0.31/default/snipcart.css')

  const snipcartScript = document.createElement("script");
  snipcartScript.setAttribute("type", "application/javascript");
  snipcartScript.setAttribute("charset", "utf-8");
  snipcartScript.setAttribute("data-cfasync", "false");
  snipcartScript.setAttribute(
    "src",
    `https://cdn.snipcart.com/themes/v3.0.31/default/snipcart.js`
  );
  target.appendChild(snipcartCSS);
  target.appendChild(snipcartScript);
}

export default {
    name: 'WhoobeSnipcart',
    data:()=>({
        apiKey : '',
        cart: false,

    }),
    computed:{
      now(){
        return new Date()
      }
    },
    beforeMount(){
      let target = document.querySelector('body')
        const snipcartCSS = document.createElement('link')
        snipcartCSS.setAttribute('rel','stylesheet')
        snipcartCSS.setAttribute('href','https://cdn.snipcart.com/themes/v3.0.31/default/snipcart.css')

        const snipcartScript = document.createElement("script");
        snipcartScript.setAttribute("type", "application/javascript");
        snipcartScript.setAttribute("charset", "utf-8");
        snipcartScript.setAttribute("data-cfasync", "false");
        snipcartScript.setAttribute(
          "src",
          `https://cdn.snipcart.com/themes/v3.0.31/default/snipcart.js`
        );
        target.appendChild(snipcartCSS);
        target.appendChild(snipcartScript);
        this.cart = true
    },
    mounted(){
        this.apiKey = this.$attrs.plugin.component.config.apikey //this.$attrs.plugin.component.config['apikey']
        // if ( process.client ){
        //   let snipcart = document.createElement('div')
        //   snipcart.setAttribute('id','snipcart')
        //   snipcart.setAttribute('class','z-top')
        //   snipcart.setAttribute("data-api-key" , this.apiKey)
        //   snipcart.setAttribute("data-config-modal-style" , 'side' )
        //   document.querySelector('#__layout').appendChild( snipcart )

        // }
    }
}
</script>

<style>
.snipcart-modal {
  z-index: 1000000;
}
</style>