<template> 
    <div :key="refreshID" :ref="doc.id" :class="pageCss(doc.css) + ' m-auto relative overflow-y-auto z-top overflow-x-hidden '" :style="stile(doc)" id="content">
        <!-- 1st level - BLOCKS LOOP -->
        <span v-if="!doc.hasOwnProperty('slider')">

            <template v-for="(block,b) in doc.blocks">
                <!-- <div videobg v-if="block.image && (block.image.ext==='.mp4' || block.image.ext==='webm')" :class="'absolute ' + block.css.css">  
                    <video playsinline :poster="block.image.previewUrl" class="object-cover h-full w-full" autoplay loop>
                        <source :src="block.image.url"/>
                    </video>
                </div> -->
                <block.preview.container 
                    :key="block.id" 
                    v-if="block && (block.type === 'grid' || block.type === 'flex' || block.type === 'slides') && block.type != 'popup'"
                    :doc="block" 
                    :level="b+1" 
                    :coords="b" 
                    />
                <block.popup v-if="block.type==='popup'"
                    :key="block.id"
                    :ref="block.id"
                    :doc="block"/>
            </template>
        </span>
        <!-- <div whoobe-global-plugins v-if="plugins">
            <template v-for="plugin in plugins">
                <plugin-wrapper :settings="plugin.editor.settings"  :block="null"  :plugin="plugin" :component="plugin.component"/>
            </template>
        </div> -->
            
    </div>
</template>

<script>

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsapEffects from '../../scripts/animations'
//import { mapState } from 'vuex'

gsap.registerPlugin ( ScrollTrigger )
const plugins = [ScrollTrigger];

export default {
    name: 'WhoobePreview',
    data:()=>({
        printScreen: null,
        refreshID: null,
        plugins: [],
        previewWidth: 'w-screen'
    }),
    props: [ 'doc' ],
    // components: {
    //     'block-container'           : () => import ( './block.preview.container.vue') ,
    // },
    computed:{
        animations(){
            
            return gsapEffects
        },
    },
    watch:{
        refreshID(){
            
        }
    },
    //props: [ 'doc' ],
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
                stl += 'font-family:"' + block.fontFamily + '";'
            }
            stl += block.hasOwnProperty('style') ? block.style : ''
            let bg = this.background(block)
            stl += bg
            return stl
        },
        background(block){
            return block.hasOwnProperty('image') ?
                block.image ?
                    ' background-image:url(' + this.$imageURL(block.image) + ');' : '' : ''
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
        start(){
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
        console.log ( 'Preview mounted' , this.doc.id )
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
                         if ( el && el.hasOwnProperty('blocks') ){
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
       
        // this.$api.service ( 'plugins' ).find().then ( res => {
        //     if  ( res.data ){
        //         res.data.forEach ( plugin => {
        //             if ( plugin.general.global ){
        //                 this.plugins.push ( plugin )
        //             }
        //         })
        //     }          
        // })
    },

}
</script>
