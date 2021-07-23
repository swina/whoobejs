<template> 
    <div :key="refreshID" :ref="doc.id" :class="pageCss(doc.css) + ' m-auto overflow-x-hidden '" :style="stile(doc,true)" id="content">
        <!-- 1st level - BLOCKS LOOP -->
            <template v-for="(block,b) in doc.blocks">
                <div videobg v-if="block.image && (block.image.ext==='.mp4' || block.image.ext==='webm' || block.image.url.indexOf('.mp4') > -1)" :class="'absolute ' + block.css.css">  
                    <video playsinline :poster="block.image.previewUrl" class="object-cover h-full w-full" autoplay loop>
                        <source :src="block.image.url"/>
                    </video>
                </div>
                <moka-container 
                    :key="block.id" 
                    v-if="(block.type==='grid' || block.type==='flex' || block.type === 'slides') && block.type != 'popup'"
                    :doc="block" 
                    :level="b+1" 
                    :coords="b" 
                    />
                <!-- <moka-container 
                    :key="block.id" 
                    v-if="!block.hasOwnProperty('slider') && !block.hasOwnProperty('collection') && !block.hasOwnProperty('popup') && block.type!='slides'"
                    :doc="block" 
                    :level="b+1" 
                    :coords="b" 
                    /> -->
                <moka-loop 
                     :key="block.id" 
                    v-if="block.hasOwnProperty('collection')"
                    :doc="block" 
                    :level="b+1" 
                    :coords="b" 
                    />
                
                <moka-popup
                    :key="block.id" 
                    :ref="block.id" 
                    v-if="block && block.type === 'popup'" 
                    :develop="true" 
                    :embeded="true" 
                    :doc="block" 
                    :editor="true"/>
                
                <moka-slider :key="block.id" v-if="block.hasOwnProperty('slider')" :develop="true" :embeded="true" :doc="block" :editor="true"/>    
            </template>
            
              
        <!-- <div v-if="!$attrs.preview">
        <div id="actionButtons" v-if="!$attrs.dashboard" class="fixed bottom-0 right-0 z-top p-4 bg-black bg-opacity-50 opacity-0 hover:opacity-100">
            <i class="material-icons nuxpresso-icon-circle mr-2" v-if="editor.save" @click="$store.dispatch('loading',true),$store.dispatch('message','Saving blocks ...'),$emit('save')">save</i>
            <i class="material-icons nuxpresso-icon-circle" @click="$emit('close')">close</i>
        </div> 
        <div id="actionButtons" v-else class="fixed bottom-0 right-0 z-top p-4 bg-black bg-opacity-50">
            <i class="material-icons nuxpresso-icon-circle" @click="$emit('close')">close</i>
        </div>
        </div> -->

        <div whoobe-global-plugins v-if="plugins">
            <template v-for="plugin in plugins">
                <moka-plugin-wrapper :settings="plugin.editor.settings"  :block="null"  :plugin="plugin" :component="plugin.component"/>
               
            </template>
        </div>   
        <!-- <div class="fixed bottom-0 right-0 mr-12 w-8 h-8 opacity-0 hover:opacity-100">
            <div class="flex flex-row relative">
                <i class="material-icons  moka-icon-circle text-white" @click="resizeTo(365)">phone_iphone</i>
                <i class="material-icons moka-icon-circle text-white" @click="resizeTo(1024,768)">tablet</i>
                <i class="material-icons moka-icon-circle text-white" @click="resizeTo(0)">laptop_mac</i>
            
            </div>
        </div>  -->
            
    </div>
</template>

<script>
import MokaContainer from './moka.preview.container'
import MokaFlex from './moka.editor.flex'
import MokaGrid from './moka.editor.grid'
import MokaSlider from './moka.slider'
import MokaPluginWrapper from '@/components/common/Plugins.Wrapper'
import MokaLoop from './moka.preview.loop'
import MokaPopup from './moka.popup'
//import MokaArticlesLoop from '@/components/editor/moka.preview.articles.loop'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin ( ScrollTrigger )
const plugins = [ScrollTrigger];
import gsapEffects from '@/scripts/animations'
import { mapState } from 'vuex'

export default {
    name: 'MokaPreview',
    data:()=>({
        printScreen: null,
        refreshID: null,
        plugins: [],
        previewWidth: 'w-screen'
    }),
    components: { 
        MokaContainer,
        MokaFlex,
        MokaGrid,
        MokaSlider ,
        //MokaElement,
        MokaPluginWrapper,
        MokaLoop,
        MokaPopup,
        'block-slides'  : () => import ( '@/components/plugins/slides/slides.vue' )

        //MokaArticlesLoop
    },
    computed:{
        ...mapState ( ['moka','editor'] ),
        animations(){
            
            return gsapEffects
        },
    },
    watch:{
        refreshID(){
            
        }
    },
    props: [ 'doc' ],
    methods: {
        resizeTo(width,height=null){
            let left = (window.screen.availWidth/2)-(width/2);
            window.resizeTo (width ? width : window.screen.availWidth , height?height:window.screen.availHeight)
            window.moveTo ( left , 0 )
            let sW = width ? width : window.screen.availWidth 
            let sH = height ? height : window.screen.availHeight
            let title = 'whoobe Preview ' + sW + 'x' + sH
            document.title = title
        },
        responsive(css){
            return this.$clean ( this.$cssResponsive ( css ) )
        },
        pageCss(cs){
            let css = cs
            if ( this.doc.hasOwnProperty ( 'body_bg' ) ){
                css += ' ' + this.doc.body_bg
            }
            if ( this.doc.hasOwnProperty ( 'body_color' ) ){
                css += ' ' + this.doc.body_color
            }
            return css
        },
        stile(block){
            let stl = ''
            if ( block.hasOwnProperty('fontFamily') ){
                document.body.style.fontFamily = block.fontFamily
                stl += 'font-family:"' + block.fontFamily + '";'
            }
            stl += block.hasOwnProperty('style') ? block.style : ''
            let bg = this.background(block)
            stl += bg 
            console.log ( stile )
            return stl
        },
        background(block){
            return block.hasOwnProperty('image') ?
                'background-image:url(' + this.$imageURL(block.image) + ');' : ''
                /*
                block.image ? 
                    ' background-image:url(' + block.image.url + ');' : '' : ''
                */
        },
        printSave(){
            this.print().then (()=>{
                this.$emit('save',this.printScreen)
                this.$emit('close')
            })
        },
       
        async print() {
            let el , options
            el = document.querySelector('#content')
            options = { type: "dataURL" , useCORS: true , scale: 0.50 }
            let screenshot = await this.$html2canvas(el, options)
            this.printScreen = screenshot
            this.$emit('save',screenshot)
        },
       
        animate(element,id   ){
                let vm = this
                !element.hasOwnProperty ( 'gsap' ) ?
                    element.gsap  = {
                        animation: '',
                        duration: .7,
                        delay:0,
                        ease:'none'
                    } : null  
                if ( this.$refs[id] ){      
                    let ani = gsap.effects[element.gsap.animation]( this.$refs[id] ,{
                        trigger: this.$refs[id],
                        duration: parseFloat(element.gsap.duration),
                        delay: parseFloat(element.gsap.delay),
                        ease: element.gsap.ease
                    })

                    //let ani = gsap.effects[element.animation]( this.$refs[id] ) 
                    
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
                        onStart:()=> { console.log ( 'started' , new Date() )},
                        onComplete:()=> { console.log ( 'completed' , new Date() )}
                        
                    });
                }
                
        },
       
        animateSub(doc){
            doc.blocks.forEach ( block => {
                if ( block.hasOwnProperty('gsap') && block.gsap.animation  ){
                    this.animate(block, block.id)
                }
                if ( block.hasOwnProperty('blocks') ){

                    block.blocks.forEach ( el => {
                        if ( el.hasOwnProperty('gsap') && el.gsap.animation ){
                            this.animate ( el , el.id   )
                        }
                        if ( el.hasOwnProperty('blocks') ){
                            el.blocks.forEach ( element => {
                                 if ( element.hasOwnProperty('gsap') && element.gsap.animation ){
                                    this.animate ( element , element.id   )
                                }
                            })
                        }
                    })
                }
            })
        }
    },
    mounted(){
        window.resizeTo ( window.screen.availWidth , window.screen.availHeight )
        let lang = document.querySelector('html')
        lang.setAttribute ( 'lang' , navigator.language )
        window.scrollTo(0,0)
        this.refreshID = this.$randomID()
        this.doc.blocks.forEach ( block => {
            if ( block.hasOwnProperty('gsap') && block.gsap.animation  ){
                this.animate(block, block.id)
            }
            if ( block.hasOwnProperty('blocks') ){
                block.blocks.forEach ( container => {
                    if ( container.hasOwnProperty('gsap') && container.gsap.animation ){
                        this.animate ( container , container.id )
                    }
                    if ( container.hasOwnProperty('blocks') ){
                    container.blocks.forEach ( el => {
                        if ( el && el.hasOwnProperty('gsap') && el.gsap.animation ){
                            this.animate ( el , el.id   )
                        }
                         if ( el && el.hasOwnProperty('blocks') && el.blocks ){
                            el.blocks.forEach ( element => {
                                 if ( element.hasOwnProperty('gsap') && element.gsap.animation ){
                                    this.animate ( element , element.id   )
                                }
                            })
                        }
                        
                    })
                    }
                })
            }
        })
        window.addEventListener("keydown", e => {
            if ( e.altKey && e.code === 'KeyX' ){
                this.$emit('close')
            }
            if ( e.altKey && e.code === 'KeyS' ){
                this.$emit('save')
            }
            if ( e.altKey && e.code === 'KeyK' ){
                let html = document.getElementById('content').outerHTML
                this.$emit('html',html)
            }
        });
        this.$api.service ( 'plugins' ).find().then ( res => {
            if  ( res.data ){
                res.data.forEach ( plugin => {
                    if ( plugin.general.global ){
                        this.plugins.push ( plugin )
                    }
                })
            }            
        })
    },

}
</script>
