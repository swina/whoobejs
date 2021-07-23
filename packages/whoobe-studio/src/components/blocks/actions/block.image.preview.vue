<template>
    <div :data-image-info="imageInfo">
        <img :src="$imageURL($mapState().editor.current.image)" class="m-auto object-cover object-top" />
    </div>
</template>

<script>
export default {
    name: 'ImagePreview',
    computed:{
        imageInfo(){
            let img = this.$mapState().editor.current.image
            return img.url + ' - ' + parseInt(img.size/1000) + 'KB - ' + img.width + 'x' + img.height//Object.values ( this.$mapState().editor.current.image )
        }
    }
}
</script>