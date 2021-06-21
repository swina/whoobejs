<template>
    <!-- <span> -->
        <component  v-if="el && !el.hasOwnProperty('plugin')" :ref="el.id" :is="component" :style="el.style" :el="el" :child="child" :attrib="$attrs"/> 
        <!-- <plugin-wrapper v-if="el && el.hasOwnProperty('plugin')" :block="el"  :plugin="el.plugin" :component="el.plugin"/>
    </span> -->
</template>

<script>
import MokaText from './elements/moka.text.vue'
import MokaLink from './elements/moka.link.vue'
import MokaVideo from './elements/moka.video.vue'
import MokaAudio from './elements/moka.audio.vue'
import MokaIframe from './elements/moka.iframe.vue'
import MokaSvg from './elements/moka.svg.vue'
import MokaImg from './elements/moka.img.vue'
import MokaIcon from './elements/moka.icon.vue'
import IconExtra from '../common/IconExtra.vue'
import MokaInput from './elements/moka.input.vue'
import MokaTextarea from './elements/moka.textarea.vue'
import MokaSimpleSvg from './elements/moka.simple.svg.vue'

export default {
    name: 'BlockElementRender',
    components: {
        MokaText,
        MokaVideo,
        MokaAudio,
        MokaIframe,
        MokaSvg,
        MokaImg,
        MokaInput,
        MokaTextarea,
        MokaSimpleSvg,

        //MokaSnipcartAddToCart,
        //MokaPluginWrapper
    },
    props: [ 'el' ],
    data:()=>({
        css: '',
        child: null
    }),
    computed:{
        component(){
            let el = this.el
            !el.link ?
                this.css = this.$cssResponsive(el.css) :
                    this.css = ''
            if ( el.hasOwnProperty ('data') && el.data.hasOwnProperty('content') ){
                el.content = el.data.content
            }
            if ( el.hasOwnProperty ('data') && el.data.hasOwnProperty('image') ){
                el.image = el.data.image
            }
            if ( this.$attrs.data ){
                //el.content = this.$attrs.data[el.label]
                if ( el.type === 'image' ){
                    el.image = {
                        url:  this.$attrs.data[el.label].replace('//','https://'),
                        caption: '',
                        alternativeText: ''
                    }
                }
            }
            if ( ( el.tag === 'element' ) && el.element != 'img' && el.type != 'video' && el.type != 'audio' ) {
                if ( el.hasOwnProperty('precision') ){
                    el.content = Number(el.content).toFixed(2)
                }
                this.child = MokaText
                return el.link ? MokaLink : MokaText
            }
            if ( el.type === 'button' ){
                if ( this.$attrs.currency ){
                    return MokaSnipcartAddToCart
                }
                this.child = MokaText
                return el.link ? MokaLink : MokaText
            }
            if ( el.type === 'video' ) {
                if ( el.element != 'iframe' ){
                    this.child = MokaVideo
                    return el.link ? MokaLink : MokaVideo
                } else {
                    this.child = MokaIframe
                    return MokaIframe
                }
            }
            if ( el.type === 'audio' ) {
                this.child = MokaAudio
                return el.link ? MokaLink : MokaAudio
            }
            
            if ( el.element === 'img' && el.image && el.image.url && el.image.ext != '.mp4' ) {
                this.child = MokaImg
                return el.link ? MokaLink : MokaImg
            }
            if ( el.tag === 'icon' || el.tag === 'icon_bt' ){
                this.child = MokaIcon
                return el.link ? MokaLink : MokaIcon
            }
            if ( el.tag === 'iconify' ){
                this.child = MokaIcon
                return el.link ? MokaLink : IconExtra
            }
            if ( el.element === 'menu' ){
                return () => import ( './elements/moka.menu.vue' )
            }
            if ( el.tag === 'input' && el.type!='button' && el.element != 'select' ){
                if ( el.type === 'checkbox' ){
                    if ( el.display === 'toggle' ){
                        return () => import ( './elements/moka.toggle.vue' )
                    }
                    return () => import ( './elements/moka.input.vue' )
                }
                return MokaInput
            } 
            if ( el.element === 'select' ){
                if ( el.display === 'select' )
                    return () => import ( './elements/moka.select.vue' )
                if ( el.display === 'chip' )
                    return () => import ( './elements/moka.chip.vue' )
                if ( el.display === 'list' )
                    return () => import ( './elements/moka.list.vue' ) 
            }
            if ( el.element === 'textarea' ){
                return MokaTextarea
            }
            
            if ( el.tag === 'article' && el.element != 'img' ){
                console.log ( 'article => ' , el.label )
                return MokaText
            }
            if ( el.tag === 'article' && el.element === 'img' ){
                return MokaImg
            }
            if ( el.type === 'file' && el.link ){
                this.child = MokaText
                return MokaLink
            }
        }
    },
    methods: {
      
    },
    
}
</script>