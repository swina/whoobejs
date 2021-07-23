<template>
    <div 
        :id="doc && doc.hasOwnProperty('anchor')? doc.anchor : doc.id"
        v-if="doc && doc.blocks.length" 
        :key="renewID"
        :class="'overflow-hidden flex flex-no-wrap moka-flipper-container '+ classe(doc.css)" :style="doc.style + ' ' +  background(doc)" :ref="doc.id" ontouchstart="this.classList.toggle('hover');">
            <div class="moka-flipper h-full w-full">
                <template v-for="(block,i) in doc.blocks">
                    
                    <moka-element
                        v-if="block && !block.hasOwnProperty('blocks') && !block.hasOwnProperty('blocks') || block.hasOwnProperty('items')"
                        @click="elementAction"
                        :key="block.id"
                        :el="block"
                        :data="$attrs.data||null"
                        :currency="$attrs.currency||null"
                        :develop="false"/> 

                    <moka-preview-single-container 
                        v-if="block.hasOwnProperty('blocks')"
                        :key="block.id"
                        :doc="block"
                        :data="$attrs.data||null"
                        :currency="$attrs.currency||null"
                        :component="$attrs.component"
                        :top="false"
                        :flipside="i"
                        :master="doc.id"
                        :run="index"
                        :index="i"
                        :id="doc.id+i"
                        :level="parseInt($attrs.level)+1" 
                        :zi="$attrs.zi + parseInt($attrs.level)"
                        :class="'absolute top-0 left-0 right-0 bottom-0 ' + getSideClass(i)"/>
                    
                </template>
        </div>    
    </div>

</template>

<script>


import MokaElement from './moka.element.component'
import MokaPreviewSingleContainer from './moka.preview.single.container'
import { mapState } from 'vuex'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin ( ScrollTrigger )
const plugins = [ScrollTrigger];
export default {
    name: 'MokaFlipboxContainer',
    data:()=>({
        index: 0,
        timer: null,
        current: null,
        currentID: null,
        renewID: null,
        
    }),
    components: { MokaElement  , MokaPreviewSingleContainer },
    props: [ 'doc'  ],
    computed:{
        ...mapState(['moka']),
        animations(){
            return gsapEffects
        }
    },
    watch:{
        index(v){
            if ( this.doc ){
                this.renewID = this.$randomID()
            }
        }
    },
    methods:{
        elementAction(action){
            this.$emit('action',action)
        },
        getSideClass(i){
            if ( i === 1 ){
                return ' moka-flipper-back'
            }
            return ' moka-flipper-front'
        },
        classe(css){
          if ( !css ) return
          let flipbox = ''
          this.doc.hasOwnProperty('image_flip') ? flipbox = ' relative ' : null
          return css.hasOwnProperty('css') ? css.css + ' ' + css.container + flipbox : css + flipbox
        },
        stile(block,doc){
            if ( !block || !doc ) return 
            let stile = ''
            if ( block.hasOwnProperty('fontFamily')){
                stile += 'font-family:\"' + block.fontFamily + '\"; '
            }
            return block.hasOwnProperty('style') ? block.style + stile : stile
        },
        background(block){
            if ( !block ) return 
            return block.hasOwnProperty('image') ?
              ' background-image:url(' + this.$imageURL(block.image) + ');' : ''
        },
        animate(element,id){
            if ( !element ) return 
            let vm = this
            if ( this.$refs && element.hasOwnProperty('gsap') && element.gsap.animation ){

                let ani = gsap.effects[element.gsap.animation]( this.$refs[id] ,{
                    trigger: this.$refs[id],
                    duration: parseFloat(element.gsap.duration),
                    delay: parseFloat(element.gsap.delay),
                    ease: element.gsap.ease
                })
                ScrollTrigger.create({
                    id: id,
                    start: "top 99%",
                    trigger: this.$refs[id],
                    toggleActions: "play pause restart none",
                    animation:ani,
                    onEnter: ()=>{ 
                        if ( element.gsap.delay ){
                            ani.play()
                        } else {
                            ani.play(0)
                        }
                    },
                    
                });
                    
            }
        },
    },
    mounted(){
      this.renewID = this.$randomID()
      if ( !this.doc && !this.doc.hasOwnProperty('gsap') && !this.doc.gsap && !this.doc.gsap.animation ) return 
        if ( this.doc.hasOwnProperty ( 'popup') && this.doc.popup.trigger ) return
            this.$animation( this.doc , this.doc.id , this.$refs )
    },
    beforeDestroy(){
      clearInterval(this.timer)
      this.timer = null
    }
}

</script>

<style>
.moka-flipper-container {
    perspective: 1000px;
}

.moka-flipper {
    transition:all .6s;
    transform-style:preserve-3d;
}

.moka-flipper-container:hover .moka-flipper ,  .moka-flipper-container.hover .moka-flipper{
    transform: rotateY(180deg);
}

.moka-flipper-front {
    transform: rotateY(0deg);
    backface-visibility: hidden;
}
.moka-flipper-back {
    transform: rotateY(180deg);
    backface-visibility: hidden;
}
</style>