<template>
<div v-if="cart" id="snipcart" data-config-modal-style="side" :data-api-key="apiKey" hidden></div>
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
    name: 'MokaSnipcart',
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
        this.apiKey = this.$attrs.apikey //this.$attrs.plugin.component.config['apikey']
    }
}
</script>