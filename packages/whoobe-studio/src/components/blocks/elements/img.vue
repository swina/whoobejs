<template>
    <img :ref="el.id" :src="hasImage" :id="el.id" :caption="el.image && el.image.name ? el.image.caption||el.image.name : 'no-image'" :alt="el.image ? el.image.alternative_text||el.image.name : 'no-image'" :title="el.image && el.image.name ? el.image.name.split('.')[0] : 'no-image'" :class="$cssResponsive(el.css)"/>
</template>

<script>
var gsap
export default {
    name: 'MokaImgElement',
    props: ['el'],
    computed:{
        hasImage(){
            if ( this.el && this.el.image && this.el.image.url ){
                return this.$imageURL(this.el.image)
            }
            //this.el.image.name = 'no-image.png'
            return require('@/assets/no-image.png') //http://localhost:8080/no-image.png'
        }
    },
    mounted(){
        gsap = this.$animation(this.el,this.el.id,this.$refs)
    },
    beforeDestroy(){
        if ( gsap ) gsap.timeline().kill()
    }
}
</script>