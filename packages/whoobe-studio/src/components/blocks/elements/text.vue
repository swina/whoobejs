<template>
    <component :ref="el.id" :id="el.id" :is="component" :class="$cssResponsive(el.css)" v-html="content"/> 
</template>

<script>
var gsap
export default {
    name: 'MokaRenderElement',
    data:()=>({
        price: ''
    }),
    props: [ 'el' ],
    computed:{
        component(){
            let el = Object.assign({},this.el)
            if ( el.hasOwnProperty('precision') ){
                
                this.$attrs.hasOwnProperty('attrib') && this.$attrs.attrib.data ? 
                    this.price = this.$attrs.attrib.data[this.el.label] : this.price = el.content
                let price = this.price.toString().split('.')
                if ( parseInt(price[0]) > 1 && price.length > 1){
                    price[1] != '' ? 
                        this.price = price[0] + '<small class="text-sm">.' + price[1] + '</small>' :
                            this.price = price[0] + '<small class="text-sm">.00</small>' 
                } else {
                    this.price = this.price + '<small class="text-sm">.00</small>'
                }
                
                this.$attrs.attrib.currency ? 
                    this.price = '<small class="text-sm">' + this.$attrs.attrib.currency + '</small> ' + this.price : null
            }
            if ( ( el.tag === 'element' || el.tag === 'article' || el.type === 'button' || el.type === 'file' ) && el.element != 'img' && el.type != 'video' && el.type != 'audio' ) {
                return el.hasOwnProperty('level') ? 'h' + el.level : el.element
            } 
        },
        content(){
            return this.$attrs.hasOwnProperty('attrib') && this.$attrs.attrib.data ?
                this.price || this.$attrs.attrib.data[this.el.label] : this.el.content
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
