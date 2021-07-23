<template>
    <!-- SLIDER -->
    <div :data="getSlider" class="z-top border bg-white flex-grow slide-container h-full">
        
        <transition name="fade">
            <div class="bg-gray-200 p-1 sticky top-0 flex flex-row items-center" v-if="sliderTools && !$attrs.slide">
                SLIDER <i title="Slider settings" class="material-icons mx-2" @click="$store.dispatch('setCurrent',doc),$action('slidersettings')">settings</i> 
                <button class="success" @click="editor.saveAsReusable=doc,$action('saveasreusable')">Save</button>
                <button class="danger" @click="$emit('remove')">Remove</button>
                
                <!--    <button class="mx-2" @click="addSlide()">Add</button>
                    
                    <button class="danger mx-2" v-if="!slideDelete && slideIndex > -1" @click="slideDelete=!slideDelete">Delete</button>
                    <button class="danger" v-if="slideDelete" @click="doc.blocks.splice(slideIndex,1),slideIndex=0,slideDelete=!slideDelete">Confirm to delete this slide?</button>
                    <button class="rounded-none mx-2" v-if="currentSlide" @click="$emit('duplicate')">Duplicate</button>
                -->
            </div>
        </transition>
        <div v-if="sliderTools">
            <label class="text-sm">Slide title </label> 
            <input type="text" class="my-1" v-model="doc.blocks[slideIndex].name"/>
        </div>
        
        <div class="flex flex-row items-center">
        <div class="items-center bg-yellow-500 text-sm border rounded-tr rounded-tl px-2">Slider <i class="material-icons" @click="sliderTools=!sliderTools">build_circle</i></div>
        <draggable :list="doc.blocks" class="flex flex-row text-sm">
            <div v-for="(slide,index) in doc.blocks" :class="'w-auto px-2 h-6 border justify-center items-center flex flex-col rounded-tr rounded-tl ' + slideSelected(index)" @click="slideDelete=false,currentSlide=slide,slideIndex=index,$store.dispatch('setCurrent',slide),$store.dispatch('selected',slide.id)">
                {{ 'Slide ' + (index+1) }}
            </div>
        </draggable>
        </div>
        
        

        <div :class="doc.css + ' absolute border-2 border-dashed p-4 text-black '" :style="stile(doc,true) + ' ' + background(doc)" id="content">
            <template v-for="(block,i) in doc.blocks">
                <!-- <moka-single-container
                    v-if="slideIndex===i"
                    :key="block.id" 
                    :doc="block"
                    :component="doc" 
                    level="0"
                    index="0"
                    :slide="true"
                    :top="true" 
                    :pos="[0,0]"
                    :coords="[0,0]" 
                    zi="1"/> -->
                <block-container
                    v-if="slideIndex===i"
                    :key="block.id" 
                    :doc="block"
                    :component="doc" 
                    level="0"
                    index="0"
                    :slide="true"
                    :top="true" 
                    :pos="[0,0]"
                    :coords="[0,0]" 
                    zi="1"/>
            </template>
        </div>
        
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
export default {
    name: 'MokaEditorSlides',
    components: { 
        draggable ,
    },
    props: [ 'doc' ],
    data:()=>({
        sliderTools: false, 
        currentSlide : 0,
        slideDelete: false,
        slideIndex:0
    }),
    computed:{
        ...mapState ( ['editor'] ),
        getSlider(){
            if ( this.doc.hasOwnProperty('slider') ){
                this.currentSlide = this.doc.blocks[0]
            }
            return true
        },
    },
    methods:{
        addSlide(){
            this.doc.blocks.push ( this.$grid(1) )
        },
        slideSelected(index){
            return index === this.slideIndex ? 'bg-blue-400 text-white' : ''
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
            //this.$store.dispatch ( 'add_tab' , tab )
            //this.$emit('newtab')
        }
    }
}
</script>