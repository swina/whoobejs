<template>
<div id="loadScript" :key="$randomID()" :ref="$randomID()">
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
  let target = document.querySelector('#loadScript')
  target.appendChild(ecwidScript);
}

function injectEcwidProductBrowser(storeId) {
  return function () {
    console.log ( 'loading categories ...')
    const ecwidBrowserScript = document.createElement("script");
    ecwidBrowserScript.setAttribute("type", "text/javascript");
    ecwidBrowserScript.setAttribute("charset", "utf-8");
    ecwidBrowserScript.text = `xCategoriesV2("id=my-categories-${storeId}");`;
    let target = document.querySelector('#loadScript')
    target.appendChild(ecwidBrowserScript);
  }
}
export default {
    name: 'MokaEcwidshop',
    data:()=>({
        shopID : ''
    }),
    mounted(){
        this.shopID = this.$attrs.el.plugin.config.storeId
        injectEcwidScript(this.shopID)
    }
}
</script>