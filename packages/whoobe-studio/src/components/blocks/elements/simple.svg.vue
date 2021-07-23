<template>
    <div :ref="el.id" :id="el.id" v-if="(el.element === 'img')  && el.image && el.image.ext === '.svg'" :class="el.css + ' fill-current'">     
        <simple-svg :src="$imageURL(el.image)" width="100%" height="100%"/>
    </div>
</template>

<script>
var gsap
export default {
    name: 'MokaImgElement',
    props: ['el'],
    mounted(){
        gsap = this.$animation(this.el,this.el.id,this.$refs)
    },
    beforeDestroy(){
        if ( gsap ) gsap.timeline().kill()
    }
}
</script>