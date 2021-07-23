<template>
    <!-- SLIDER -->
    <div class="z-top bg-white h-full slide-container pb-20 theme-dark" style="font-family:'Asap Condensed';" :id="doc.id" v-if="doc">
        
        <!-- <transition name="fade"> -->
            <!-- <div class="bg-gray-200 p-1 sticky top-0 flex flex-row items-center" v-if="sliderTools && !$attrs.slide"> -->
                <!-- SLIDER <i title="Slider settings" class="material-icons mx-2" @click="$store.dispatch('setCurrent',doc),$action('slidersettings')">settings</i>  -->
                <div class="">
                    <button @click="editor.current=doc,$action('slides_settings')" title="Slides settings" data-tool-tip="Slides settings">SLIDES <icon class="text-xs" name="settings"/></button>
                    <!-- <button @click="removeSlides" title="Save slides as reusable block" data-tool-tip="Remove Slides">Remove</button> -->
                    <button @click="editor.saveAsReusable=doc,$action('saveasreusable')" title="Save slides as reusable block" data-tool-tip="Save slides as reusable block">Save</button>
                    <button @click="addSlide()" data-tool-tip="Add slide">Add Slide</button>
                </div>
            <!-- </div> -->
        <!-- </transition> -->
        <div v-if="sliderTools">
            <label class="text-sm">Slide title </label> 
            <input type="text" class="my-1" v-model="doc.blocks[slideIndex].name"/>
        </div>
        
        <div class="flex flex-row items-center">
        <!-- <div class="items-center bg-yellow-500 text-sm border rounded-tr rounded-tl px-2">Slider <i class="material-icons" @click="sliderTools=!sliderTools">build_circle</i></div> -->
        <draggable :list="doc.blocks" class="flex flex-row text-sm h-full">
            <div v-for="(slide,index) in doc.blocks" :class="'w-auto h-full px-2 h-6 border justify-center items-center flex flex-col rounded-tr rounded-tl ' + slideSelected(index)" @click="slideDelete=false,currentSlide=slide,slideIndex=index,block=slide">
                {{ 'Slide ' + (index+1) }}
            </div>
        </draggable>
        </div>

        <div :class="doc.css + ' border-2 border-dashed text-black h-full '" :style="stile(doc,true) + ' ' + background(doc)" :id="doc.id">
            
            <template v-for="(block,n) in doc.blocks">
                <block-container
                    class="h-full"
                    :key="block.id"
                    :component="$attrs.component"
                    :top="false"
                    :root="$attrs.root||false"
                    :coords="$attrs.coords"
                    :slide="$attrs.slide"
                    :flipbox="doc.hasOwnProperty('blocks_flip')? true : false" 
                    :index="parseInt($attrs.level)+1"
                    :level="parseInt($attrs.level)+1" 
                    :zi="$attrs.zi + parseInt($attrs.level)"
                    v-if="block && n === slideIndex && block.hasOwnProperty('blocks') && block.type != 'element' && !block.hasOwnProperty('blocks_flip')" 
                    :doc="block"
                    @copy="$emit('copy')"/>
            </template>
        </div>
        
         
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
import jp from 'jsonpath'
export default {
    name: 'PluginSlidesEditor',
    components: { 
        draggable ,
    },
    data:()=>({
        doc: null,
        block: null,
        sliderTools: false, 
        currentSlide : 0,
        slideDelete: false,
        slideIndex:0
    }),
    computed:{
        ...mapState ( ['editor'] ),
        
    },
    watch:{
        currentSlide(v){
            this.doc.counter = this.doc.blocks.length
            this.block = v
        },
        slideIndex(i){
            console.log ( this.doc.blocks[i].id )
            this.editor.current = this.doc.blocks[i]
            this.$store.dispatch('selected',this.doc.blocks[i].id )
        }
    },
    methods:{
        addSlide(){
            this.doc.blocks.push ( this.$grid(1) )
            this.doc.counter = this.doc.blocks.length
            this.editor.current = this.doc.blocks[this.doc.blocks.length-1]

        },
        slideSelected(index){
            return index === this.slideIndex ? 'bg-gray-900 text-white' : ''
        },
        removeSlides(){
            
            let parent = jp.parent ( this.$attrs.component , '$..blocks[?(@.type=="slides")]' )[0]
            console.log ( parent )
        },
        stile(){
            return
        },
        classe(css){
            return
        },
        background(img){
            return
        },
        openEditor(){
            return
            // this.$store.dispatch ( 'loadComponent' , this.doc )
            // let tab = {
            //     name: 'Slider',
            //     component: () => import ( '@/components/moka/moka'),
            //     blocks: this.doc,
            //     icon: 'edit',
            //     filter: '',
            //     ref: this.$randomID()
            // }
            // console.log ( tab )
        }
    },
    mounted(){
        console.log ( this.$attrs.doc )
        this.doc = Object.assign ( {} , this.$attrs.doc )
        this.doc.css = ''
    }
}
</script>