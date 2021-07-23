 <template>
    <svg :ref="el.id" width="100%" height="100%" :viewBox="el.content.viewBox" v-html="el.content.g" :class="el.css + ' fill-current'"></svg>
</template>
<script>
var gsap
export default {
    name: 'MokaSvgElement',
    props: [ 'el' ],
    mounted(){
        gsap = this.$animation(this.el,this.el.id,this.$refs)
    },
    beforeDestroy(){
        if ( gsap ) gsap.timeline().kill()
    }
}
</script>
