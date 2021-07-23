<template>
    <video :ref="el.id" :id="el.id" :class="$cssResponsive(el.css)" v-if="el && el.type==='video' && el.image && el.image.url" :autoplay="el.hasOwnProperty('options')?el.options.autoplay:true" 
        :controls="el.hasOwnProperty('options')?el.options.controls:true"
        :loop="el.hasOwnProperty('options')?el.options.loop:true">
        <source :src="el.image.url">
    </video> 
</template>

<script>
var gsap
export default {
    name: 'MokaVideoElement',
    props: [ 'el' ],
    mounted(){
        gsap = this.$animation(this.el,this.el.id,this.$refs)
    },
    beforeDestroy(){
        if ( gsap ) gsap.timeline().kill()
    }
}
</script>