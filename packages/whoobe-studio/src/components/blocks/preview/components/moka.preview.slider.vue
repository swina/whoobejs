<template>
<!-- MAIN CONTAINER -->
<div :class="doc.css + ' flex flex-no-wrap'" :style="stile(doc) + ' ' + background(doc)" :id="$randomID()" :autoplay="autoplay()">
    <!-- 1st level - BLOCKS LOOP --> 
    
    <div v-for="(block,b) in doc.blocks" ref="slide" :class="'slide flex-none top-0 left-0 right-0 bottom-0 w-full bg-center bg-cover bg-no-repeat ' + responsive(block.css.css) + ' ' + block.css.container" :style="stile(block) + background(block)" :key="block.id" :ref="block.id">
        <!-- 2nd level - BLOCKS LOOP --->
        <div v-for="(row) in block.blocks" :class="'flex flex-col h-full ' + responsive(row.css)" :style="stile(row) + background(row)" :key="row.id" :ref="row.id">
            
            <!-- BLOCKS ELEMENTS LOOP -->
            <div v-for="(element) in row.blocks" v-if="!row.hasOwnProperty('slider')" :key="element.id" :ref="element.id" @mouseover="checkAni(element)">
                <moka-element
                     @click="hasSlideAction"
                    :element="element"
                    v-if="element.type!='grid' && element.type!='flex'" 
                    :coords="[]"
                    :develop="false"/>

                <div flex v-else 
                    :class="responsive(element.css.css) + ' text-base ' + element.css.container" 
                    :style="stile(element) + ' ' + background(element)">
                    
                    <moka-element
                        @click="hasSlideAction"
                        :sub="true"
                        :key="el.id"
                        :element="el"
                        v-if="!el.hasOwnProperty('blocks')"
                        v-for="el in element.blocks"
                        :coords="[]"
                        :loop="$attrs.loop"
                        :develop="false"/>
                        
                <!-- BLOCK ELEMENT IS A GRID/CONTAINER -->
                <!--<div v-else :class="responsive(element.css.css) + ' ' + element.css.container">-->
                    <div v-if="!element.loop && element.type!='flex'" v-for="(subrow) in element.blocks" :class="responsive(subrow.css) + ' bg-center bg-cover bg-no-repeat'" :style="stile(subrow) + background(subrow)" :key="subrow.id">
                        <div v-for="(subelement) in subrow.blocks" :key="subelement.id">
                            <moka-element 
                                
                                :element="subelement" 
                                v-if="subelement.type!='grid'" 
                                :coords="[]"
                                :develop="false"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    </div>
        <div v-if="doc.slider.dots.enable" class="mb-2 absolute left-0 bottom-0 w-full m-auto flex flex-row justify-center">
            <div :key="d" v-for="(dot,d) in doc.slider.blocks" title="" :class="'nuxpresso-slider-dots mr-2 nuxpresso-slider-dot-active ' + isActive(d)" @click="index=d"></div>
        </div>
        <div v-if="doc.slider.navigation.enable">
            <div class="p-0 md:p-2 absolute md:opacity-0 hover:opacity-100 z-top" style="top:50%;left:0;transform:translateY(-50%)" @click="prev" >
                <i class="material-icons text-3xl md:text-5xl text-white cursor-pointer bg-gray-400 rounded-full hover:bg-black hover:text-white">chevron_left</i>
            </div>
            <div class="p-0 md:p-2 absolute md:opacity-0 hover:opacity-100" style="top:50%;right:0;transform:translateY(-50%)" @click="next">
                <i class="material-icons text-3xl md:text-5xl text-white cursor-pointer bg-gray-400 rounded-full hover:bg-black hover:text-white">chevron_right</i>
            </div>
        </div>
    <div v-if="$attrs.develop && !$attrs.editor" class="flex flex-row z-top p-1 fixed right-0 top-0">
        <i v-if="$attrs.develop" class="material-icons nuxpresso-icon-circle text-black mr-2" title="Save" @click="print">save</i>
        <i class="material-icons nuxpresso-icon-circle text-black" title="Close" @click="stop(),$emit('close')">close</i>
    </div>
    
</div>
</template>

<script>
import MokaElement from './moka.element'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
gsap.registerPlugin ( ScrollTrigger )
gsap.registerPlugin ( Draggable )

const plugins = [ScrollTrigger];
import gsapEffects from '@/scripts/animations'

export default {
    name: 'MokaPreviewSlider',
    data:()=>({
        printScreen: null,
        index:-1,
        timer: null
    }),
    components: { 
        MokaElement
    },
    props: [ 'doc' ],
    
    beforeDestroy(){
        window.clearInterval(this.timer)
    },
    methods: {
        hasSlideAction(action){
            console.log ( action )
            action === 'slider_next' ?
                    this.next() : 
                        action === 'slider_prev' ? this.prev()
                             : null
        },
        autoplay(){
            let vm = this
            parseInt(vm.doc.slider.delay) ?
            this.timer = window.setInterval( function(){
                    vm.next()
                },parseInt(vm.doc.slider.delay)*1000) 
                : null
        },
        stop(){
            window.clearInterval(this.timer)
        },
        checkAni(){
            return null
        },
        responsive(css){
            return this.$clean ( this.$cssResponsive ( css ) )
            
        },
        stile(block){
            return block.hasOwnProperty('style') ? block.style : ''
        },
        background(block){
            return block.hasOwnProperty('image') ?
                ' background-image:url(' + this.$imageURL(block.image) + ');' : ''
                /*
                block.image ? 
                    ' background-image:url(' + block.image.url + ');' : '' : ''
                */
        },
        next(){
            this.index < (this.doc.blocks.length-1) ? this.index++ : this.index = 0
            
            console.log ( 'clicked next =>' , this.index )
            let block = this.doc.blocks[this.index]
            let tl = gsap.timeline()
            tl.to ( '.slide' , { xPercent: -this.index*100 , opacity:1 , duration: 1.5 } )
            
            if ( block.hasOwnProperty('animation') && block.animation ){
                tl[block.animation] ( '.slide' , { duration: .5} )
                //console.log ( block.id , block.animation ) 
                //this.animate ( block , block.id , 1.5 )
            }

            block.blocks.forEach ( container => {
                if ( container.hasOwnProperty('animation') && container.animation ){
                    tl[container.animation]( this.$refs[container.id] , { duration: .5 } )
                    //this.animate ( container , container.id , 1.5 )
                }
                container.blocks.forEach ( el => {
                    if ( el.hasOwnProperty('animation') && el.animation ) {
                        tl[el.animation]( this.$refs[el.id] )
                        //this.animate ( el , el.id , 1.5)
                    }
                })
            })
            //this.animate(this.doc.blocks[this.index],this.doc.blocks[this.index].id)  
            //this.index < (this.$attrs.slider.blocks.length-1) ? this.index++ : this.index = 0
        },
        prev(){
            this.index > 0 ? this.index-- : this.index = 0
            console.log ( 'clicked prev =>' , this.index )
            let block = this.doc.blocks[this.index]
            let tl = gsap.timeline()
            tl.to ( '.slide' , { xPercent: this.index*100 , duration: 1.5 } )

            if ( block.hasOwnProperty('animation') && block.animation ){
                tl[block.animation] ( '.slide' , { duration: .5} )
                //console.log ( block.id , block.animation )
                //this.animate ( block , block.id , 1.5 )
            }
            block.blocks.forEach ( container => {
                if ( container.hasOwnProperty('animation') && container.animation ){
                    tl[container.animation]( this.$refs[container.id] , { duration: .5 } )
                    //this.animate ( container , container.id , 1.5 )
                }
                container.blocks.forEach ( el => {
                    if ( el.hasOwnProperty('animation') && el.animation ) {
                        tl[el.animation]( this.$refs[el.id] )
                        //this.animate ( el , el.id , 1.5)
                    }
                })
            }) 
        },
        animate(element,id){
            let vm = this
            if ( element.animation.indexOf('hover') < 0 ){   
                let ani = gsap.effects[element.animation]( this.$refs[id] ,{
                    trigger: this.$refs[id],
                    duration:2
                }) 
                ScrollTrigger.create({
                    id: id,
                    start: "top 20%",
                    trigger: this.$refs[id],
                    toggleActions: "restart pause restart none",
                    animation: ani,
                });
            }
        },
        isActive(i){
            return i === this.index ? ' animate-ping bg-white' : ''
        },
        async print() {
            let el , options
            el = document.querySelector('#content')
            options = { type: "dataURL" , useCORS: true , scale: 0.50 }
            let screenshot = await this.$html2canvas(el, options)
            this.$emit('save',screenshot)
        },
    },
    mounted(){
        window.scrollTo(0,0)
       
        this.next()
        /*
        gsap.to('.slide', {
            x: 0,
            duration: 1.5,
        });  
        window.scrollTo(0,0)
        this.doc.blocks.forEach ( block => {
            if ( block.hasOwnProperty('animation') && block.animation  ){
                this.animate(block, block.id)
            }
            block.blocks.forEach ( container => {
                if ( container.hasOwnProperty('animation') && container.animation ){
                    this.animate ( container , container.id )
                }
                container.blocks.forEach ( el => {
                    if ( el.hasOwnProperty('animation') && el.animation ) this.animate ( el , el.id )
                })
            })
        })
        */
    }

}
</script>
