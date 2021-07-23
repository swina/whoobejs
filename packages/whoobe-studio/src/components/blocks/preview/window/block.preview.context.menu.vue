<template>
    <div>
        <div class="preview-context-menu-item" @click="$action('savecomponent')">
            <i class="material-icons mr-4">save</i>Save
        </div>
        <div class="preview-context-menu-item" @click="$emit('printscreen')">
            <i class="material-icons mr-4">photo</i>Print Screen
        </div>
        <div class="border-b border-t p-1 border-gray-700 text-gray-700">Preview</div>
        <div class="preview-context-menu-item" @click="$emit('html')">
            <i class="material-icons mr-4">code</i>HTML
        </div>
        <div class="preview-context-menu-item" @click="resizeTo(365)">
            <i class="material-icons mr-4">phone_iphone</i>Phone
        </div>
        <div class="preview-context-menu-item" @click="resizeTo(1024,768)">
            <i class="material-icons mr-4">tablet</i>Tablet
        </div>
        <div class="preview-context-menu-item" @click="resizeTo(0)">
            <i class="material-icons mr-4">laptop_mac</i>Laptop
        </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobePreviewContextMenu',
    methods: {
        resizeTo(width,height=null){
            let left = (window.screen.availWidth/2)-(width/2);
            window.resizeTo (width ? width : window.screen.availWidth , height?height:window.screen.availHeight)
            window.moveTo ( left , 0 )
            window.localStorage.setItem('whoobe-preview-mode',width)
            let sW = width ? width : window.screen.availWidth 
            let sH = height ? height : window.screen.availHeight
            let title = 'whoobe Preview ' + sW + 'x' + sH
            document.title = title
        },
    }
}
</script>