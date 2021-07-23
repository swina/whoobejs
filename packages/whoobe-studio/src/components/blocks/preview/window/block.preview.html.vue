<template>
    <div>
        <textarea v-model="html" class="w-full h-4/5 font-mono text-xs" style="font-family:monospace"></textarea>
    </div>
</template>

<script>
export default {
    name: 'WhoobePreviewHtml',
    data:()=>({
        html: ''
    }),
    mounted(){
        let html = document.getElementById('content').outerHTML
        this.html = this.$beautify ( html.replaceAll('<!---->','').replaceAll('[object Object]','') )
    }
}
</script>