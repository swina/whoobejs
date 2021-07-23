<template>
    <a :href="el.link" :ref="el.id" :caption="el.content" :alt="el.content" :title="el.content" :class="$cssResponsive(el.css)">{{ el.content }}</a>
</template>

<script>
var gsap
export default {
    name: 'MokaDownloadElement',
    props: ['el'],
    mounted(){
        gsap = this.$animation(this.el,this.el.id,this.$refs)
    },
    beforeDestroy(){
        if ( gsap ) gsap.timeline().kill()
    }
}
</script>