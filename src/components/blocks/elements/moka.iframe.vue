<template>
    <iframe 
        v-if="el.content" 
        :src="el.src + el.content" 
        :class="$cssResponsive(el.css)" 
        :autoplay="el.hasOwnProperty('options')?el.options.autoplay:true" 
        :controls="el.hasOwnProperty('options')?el.options.controls:true"
        :loop="el.hasOwnProperty('options')?el.options.loop:true">
    </iframe>
</template>


<script>
var gsap
export default {
    name: 'MokaAudioElement',
    props: [ 'el' ],
    mounted(){
        gsap = this.$animation(this.el,this.el.id,this.$refs)
    },
    beforeDestroy(){
        if ( gsap ) gsap.timeline().kill()
    }
}
</script>