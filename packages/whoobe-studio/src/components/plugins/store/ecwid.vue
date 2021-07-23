<template>
<div id="loadShop" :key="$randomID()" :ref="$randomID()" :date="now">
    <div :id="'my-store-' + shopID"></div>
</div>
</template>

<script>

function injectEcwidScript(storeId) {
  const ecwidScript = document.createElement("script");
  ecwidScript.setAttribute("type", "text/javascript");
  ecwidScript.setAttribute("charset", "utf-8");
  ecwidScript.setAttribute("data-cfasync", "false");
  ecwidScript.setAttribute(
    "src",
    `https://app.ecwid.com/script.js?${storeId}&data_platform=code&data_date=${new Date()}`
  );
  ecwidScript.onload = injectEcwidProductBrowser(storeId);
  let target = document.querySelector('#loadShop')
  target.appendChild(ecwidScript);
}

function injectEcwidProductBrowser(storeId) {
  return function () {
      console.log ( 'loading shop ...')
    const ecwidBrowserScript = document.createElement("script");
    ecwidBrowserScript.setAttribute("type", "text/javascript");
    ecwidBrowserScript.setAttribute("charset", "utf-8");
    ecwidBrowserScript.text = `xProductBrowser("categoriesPerRow=3","views=grid(20,3) list(60) table(60)","categoryView=grid","searchView=list","id=my-store-${storeId}");`;
    let target = document.querySelector('#loadShop')
    target.appendChild(ecwidBrowserScript);
  }
}

function removeScript(){
  let target = document.querySelector('#loadShop')
  console.log ( target )
}
export default {
    name: 'MokaEcwidshop',
    data:()=>({
        shopID : ''
    }),
    computed:{
      now(){
        return new Date()
      }
    },
    mounted(){
        this.shopID = this.$attrs.config.storeId
        injectEcwidScript(this.shopID)
    },
    beforeDestroy(){
      removeScript()
    }
}
</script>
<style>
.grid__categories {
  display:none;
}
</style>