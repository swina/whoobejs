<template>
    <!-- <span> -->
        <component  v-if="el && !el.hasOwnProperty('plugin')" :ref="el.id" :is="component" :style="el.style" :el="el" :child="child" :attrib="$attrs" :data="getAttributes()" :id="el.id"/> 
        <!-- <plugin-wrapper v-if="el && el.hasOwnProperty('plugin')" :block="el"  :plugin="el.plugin" :component="el.plugin"/> -->
    <!-- </span> -->
</template>

<script>
import MokaText from './elements/moka.text'
import MokaLink from './elements/moka.link'
import MokaVideo from './elements/moka.video'
import MokaAudio from './elements/moka.audio'
import MokaIframe from './elements/moka.iframe'
import MokaSvg from './elements/moka.svg'
import MokaImg from './elements/moka.img'
import MokaIcon from './elements/moka.icon'
import IconExtra from '@/components/common/supericon.vue'
import MokaInput from './elements/moka.input'
import MokaToggle from './elements/moka.toggle.vue'
import MokaTextarea from './elements/moka.textarea'
import MokaSelect from './elements/moka.select'
import MokaChip from './elements/moka.chip.vue'
import MokaList from './elements/moka.list.vue'
import MokaSimpleSvg from './elements/moka.simple.svg'
//import MokaSnipcartAddToCart from '@/components/plugins/store/nuxpresso/snipcart.add.to.cart'
//import MokaPluginWrapper from '@/components/common/Plugins.Wrapper'
export default {
    name: 'BlockElementSelector',
    components: {
        MokaText,
        MokaVideo,
        MokaAudio,
        MokaIframe,
        MokaSvg,
        MokaImg,
        MokaInput,
        MokaToggle,
        MokaTextarea,
        MokaSelect,
        MokaChip,
        MokaList,
        MokaSimpleSvg,
        IconExtra
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
            
            if ( el.tag === 'article' && this.$route.query && this.$route.query.mode === 'article' ){
                let article = JSON.parse ( window.localStorage.getItem('whoobe-article') )
                el.type != 'image' ?
                    el.content = article[el.label] :
                        article[el.label] ? el.image = article[el.label] : el.image = null
                
            }
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
            //if ( el.type === 'svg'  ){
            //    this.child = MokaSvg
            //    return el.link ? MokaLink : MokaSvg
            //}
            // if ( (el.element === 'img')  && el.image && el.image.ext === '.svg' ) {
            //     this.child = MokaSimpleSvg
            //     return el.link ? MokaLink : MokaSimpleSvg    
            // }
            if ( el.element === 'img' && el.image && el.image.url && el.image.ext != '.mp4' ) {
                this.child = MokaImg
                return el.link ? MokaLink : MokaImg
            }
            if ( el.tag === 'icon' || el.tag === 'icon_bt' ){
                this.child = MokaIcon
                return el.link ? MokaLink : MokaIcon
            }

            if ( el.type === 'iconify' ){
                this.child = IconExtra
                return el.link ? MokaLink : IconExtra
            }
            
            if ( el.element === 'menu' ){
                return MokaMenu
            }
            if ( el.tag === 'input' && el.type!='button' && el.element != 'select' && el.element != 'textarea'){
                if ( el.type === 'checkbox' ){
                    if ( el.display === 'checkbox')
                        return MokaInput
                    if ( el.display === 'toggle' )
                        return MokaToggle
                }
                return MokaInput
            } 
            if ( el.element === 'textarea' ){
                return MokaTextarea
            }
            if ( el.element === 'select' ){
                if ( el.display === 'select' ){
                    return MokaSelect
                }
                if ( el.display === 'chip' ){
                    return MokaChip
                }
                if ( el.display === 'list' ){
                    return MokaList
                }
            }
            
            if ( el.tag === 'article' && el.element != 'img' ){
               return MokaText
            }
            if ( el.tag === 'article' && el.element === 'img' ){
                return MokaImg
            }
            if ( el.type === 'file' && el.link ){
                this.child = MokaText
                return MokaLink
            }
            if ( el.type === 'plugin' ){
                if ( el.plugin.component.module.url ){
                    return                 
                }
                return () =>  import(/* webpackChunkName: 'nuxpresso_' */ '@/components/plugins/' + el.plugin.component ) 
            }
        }
    },
    methods: {
      getAttributes(){
          if ( this.el.hasOwnProperty('attributes') && this.el.attributes['data-link'] ){
              console.log ( this.el.attributes )
              let element = document.getElementById(this.el.id)
              if ( element && this.$attrs.dataset.link ){
                  Object.keys(this.el.attributes).forEach ( key => {
                    console.log ( this.$attrs.dataset.link , key )
                    console.log ( this.el.attributes[key].split('%')[1] )
                    if ( this.el.attributes[key].split('%')[1] ){
                        let field = this.el.attributes[key].split('%')[1]
                        element.setAttribute ( key , this.$attrs.dataset.link[field] )
                    }
                })
            }   
          }
      }
    },
    
}
</script>