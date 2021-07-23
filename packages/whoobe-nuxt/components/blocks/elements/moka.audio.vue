<template>
    <audio 
        :id="el.id"
        :ref="el.id" :class="$cssResponsive(el.css)" 
        v-if="el && el.type==='audio' && el.image && el.image.url" 
        :autoplay="el.hasOwnProperty('options')?el.options.autoplay:true" 
        :controls="el.hasOwnProperty('options')?el.options.controls:true"
        :loop="el.hasOwnProperty('options')?el.options.loop:true">
        <source :src="$imageURL(el.image)">
    </audio>
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