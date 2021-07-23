<template>
    <div 
        :ref="blocks.id"
        :list="blocks.blocks" 
        v-if="blocks && blocks.hasOwnProperty('id')" 
        :class="'relative '  + Object.values(blocks.css).join('')"
        :style="blocks.style + ' ' + background(blocks)">
        <div videobg v-if="blocks.image && blocks.image.ext==='.mp4'" :class="'absolute ' + blocks.css">  
            <video playsinline :poster="blocks.image.previewUrl" class="object-cover h-full w-full" autoplay loop>
                <source :src="blocks.image.url"/>
            </video>
        </div>
        <span v-if="!blocks.blocks.length">add an element</span>
        <div v-for="(el,i) in blocks.blocks" :ref="el.id">

            <moka-element  
                :key="el.id"
                :element="el"
                v-if="el && el.type != 'flex' && el.type != 'grid'"
                :coords="$attrs.coords"
                :develop="$attrs.develop"/>

             <moka-grid 
                v-if="el.type==='grid'" 
                :key="el.id" 
                :doc="$attrs.doc"
                :blocks="el" 
                :index="i"
                :coords="$attrs.coords" 
                :develop="$attrs.develop"/> 

            <div 
                tag="div" 
                :ref="el.id"
                :list="el.blocks" 
                v-if="el && el.hasOwnProperty('id') && el.type === 'flex'" 
                :class="'relative ' + Object.values(el.css).join(' ')"
                :style="el.style + ' ' + background(el)">
                <span v-if="!el.blocks.length">add an element</span>
                <div v-for="(sub,s) in el.blocks">
                    <moka-element  
                        :key="sub.id"
                        :element="sub"
                        v-if="sub && sub.type != 'flex'"
                        :coords="$attrs.coords"
                        :develop="$attrs.develop"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import MokaElement from './moka.element'
import MokaGrid from './moka.editor.grid'
import { mapState } from 'vuex'


import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin ( ScrollTrigger )
const plugins = [ScrollTrigger];
import gsapEffects from '@/scripts/animations'

export default {
    name: 'MokaFlex',
    components:{ MokaElement , MokaGrid },
    props:['blocks','doc'],
    computed: {
        ...mapState ( ['moka']),
        animations(){
            return gsapEffects
        }
    },
    methods: {
        switchFlex(el,css){
            if ( el.id === this.moka.selected ){
                if ( !css.length ) { 
                    el.css.css = 'flex-col'
                    return
                }
                if ( css.indexOf('flex-col') < 0 ){
                    el.css.css += ' flex-col'
                } else {
                    el.css.css = el.css.css.replace('flex-col','')
                }
            }
        },
        background(block){
            return block.hasOwnProperty('image') ?
                block.image && block.image.url ? 
                    block.image.previewUrl ? 
                        ' background-image:url(' + block.image.previewUrl + ');background-size:cover;background-repeat:no-repeat;' :
                            ' background-image:url(' + block.image.url + ');' : ''  : ''        
        },
        active(id){
            if ( this.moka && this.moka.selected ) {
                return this.moka.selected === id ? 'opacity-100' : 'opacity-0 hover:opacity-100'
            } else {
                return 'opacity-0 hover:opacity-100 '
            }
        },
        setCurrent(arr,element){
            let coords = this.$attrs.coords
            if ( arr ){
                arr.forEach ( a => {
                    coords.push ( a )
                })
            }
            this.$store.dispatch('selected',element.id)
            this.$emit('selected',coords,element)
        },
        setCurrentSub(arr,element){
            let coords = this.$attrs.coords
            //coords.push ( index )
            if ( arr ){
                arr.forEach ( a => {
                    coords.push ( a )
                })
            }
            this.$store.dispatch('selected',element.id)
            this.$emit('selected',coords,element)
        },
        swap(arr,flag,el){
            //this.setCurrent(arr,el.id)
            this.$emit('swap',flag) 
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
    },
    mounted(){
        if ( !this.$attrs.develop ){
        console.log ( this.blocks.gsap )   
        window.scrollTo(0,0)
        if ( this.blocks.hasOwnProperty('gsap') && this.blocks.gsap.animation ){
            this.animate ( this.blocks , this.blocks.id )
        }
        this.blocks.blocks.forEach ( block => {
            if ( block.hasOwnProperty('gsap') && block.gsap.animation  ){
                console.log ( block.gsap.animation , block.id , this.$refs[block.id] )
                this.animate(block, block.id)
            }
            if ( block.hasOwnProperty('blocks') ){
                block.blocks.forEach ( container => {
                    if ( container.hasOwnProperty('gsap') && container.gsap.animation ){
                        this.animate ( container , container.id )
                    }
                    container.blocks.forEach ( el => {
                        if ( el.hasOwnProperty('gsap') && el.gsap.animation ){
                            this.animate ( el , el.id   )
                        }
                         if ( el.hasOwnProperty('blocks') ){
                            el.blocks.forEach ( element => {
                                 if ( element.hasOwnProperty('gsap') && element.gsap.animation ){
                                    console.log ( element , element.gsap )
                                    this.animate ( element , element.id   )
                                }
                            })
                        }
                        
                    })
                })
            }
        })
        }
    }
}
</script>