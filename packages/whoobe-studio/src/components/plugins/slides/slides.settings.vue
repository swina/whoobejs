<template>
    <div v-if="slider" class="theme-dark p-2">
        <div class="flex flex-col text-sm my-2 bg-gray-200 rounded p-1">
           

            <div v-if="context==='controls' && slider[context]" class="flex flex-row">
                <label class="ml-2">Autoplay secs</label>
                <input class="w-6 mr-2" type="number" min="1" max="100000" title="Set 0 to disable autoplay" v-model="slider[context].delay"/> 0 = no autoplay
            </div>

            <div v-if="context==='slider'" class="flex flex-row my-1 p-1 border-b">
                <label>Fullscreen</label>
                <input type="checkbox" class="w-full" v-model="fullscreen"/>
            </div>
            <div v-if="context==='slider'" class="flex flex-row my-1 p-1 border-b">
                <label>CSS</label>
                <input type="text" class="w-full" v-model="slider.css" placeholder="whoobe-fullscreen-gallery"/>
            </div>

            <div v-if="context==='gallery'" class="flex flex-row">
                <label>Animation</label>
                <select class="mr-2" v-model="slider[context].animation">
                    <option value="imageFade">Fade</option>
                    <option value="imageSlide">Slide</option>
                </select>
                <label class="ml-2">Slide/Animation duration secs</label>
                <input class="w-6" type="number" min="1" max="100000" title="set 0 for autoplay" v-model="slider[context].delay"/>
            </div>
            
            <!-- <div class="flex flex-col my-1 p-1 border-b">
                <label>Custom animation</label>
                <div class="flex flex-row items-center">
                    <input type="text" v-model="slider[context].custom"/>
                    <icon name="edit" @click="keyframes=!keyframes"></icon> keyframes
                </div>
                
                    <transition name="fade">
                        <div class="flex flex-col" v-if="keyframes">
                            <label class="">Keyframes</label>
                            <textarea class="w-full h-64" v-model="slider[context].keyframes"/>
                        </div>
                    </transition>
            </div> -->
            <div class="flex flex-row my-1 p-1" title="add navigation icons">
                <input type="checkbox" v-model="slider[context].navigation.enable"/>
                <label class="ml-2">Navigation</label>
            </div>
            <div class="flex flex-row items-center justify-between my-1 p-1 border-b">
                <label>Icons</label>
                <div class="flex flex-row my-2"  title="click select navigation icons">
                    <i class="material-icons border border-dashed text-xl mx-2" 
                    @click="iconSelect=!iconSelect,icon=slider[context].navigation.icons[0],iconIndex=0">{{ slider[context].navigation.icons[0]}}</i>
                    <i class="material-icons border border-dashed text-xl" @click="iconSelect=!iconSelect,icon=slider[context].navigation.icons[1],iconIndex=1">{{ slider[context].navigation.icons[1]}}</i>
                </div>
                <label class="ml-2">Size</label>
                <select v-model="slider[context].navigation.size">
                    <option value="text-base">Normal</option>
                    <option value="text-3xl">Big</option>
                    <option value="text-10xl">Max</option>
                </select>
                <label class="ml-2">Position</label>
                <select v-model="slider[context].navigation.position">
                    <option value="items-center">Center</option>
                    <option value="items-start">Top</option>
                    <option value="items-end">Bottom</option>
                </select>
                <div class="text-sm" title="navigation icons color">
                    <moka-color attr="textcolor" v-model="slider[context].navigation.color" :css="slider[context].navigation.css"/>
                </div>
            </div>
            <div class="flex flex-col my-1 p-1 border-b" title="add navigation icons">
                Navigation CSS
                <textarea class="w-full" v-model="slider[context].navigation.css"/>
            </div>
            <div class="flex flex-row my-1 p-1 border-b" title="show navigation icons only on mouseover">
                <input type="checkbox" v-model="slider[context].navigation.hover"/>
                <label class="ml-2">Navigation onmouseover</label>
                
            </div>
            
            <div class="flex flex-row items-center justify-between my-1 p-1 border-b" title="add navigation dots">
                <div>
                    <input type="checkbox" v-model="slider[context].dots.enable"/>
                    <label class="ml-2">Dots</label>
                </div>
                <moka-color class="text-sm" attr="textcolor" v-model="slider[context].dots.css" :css="slider[context].dots.css" title="navigation dots color"/> 
                <!--<input type="text" v-model="slider[context].dots.css" placeholder="class"/>-->
            </div>

            <div v-if="context==='slider'">
            <div class="flex flex-row my-1 p-1" title="add slider buttons">
                <input type="checkbox" v-model="slider[context].buttons"/>
                <label class="ml-2">Slides buttons <span class="text-xs">(not available on mobile)</span></label>
            </div>
            <div class="flex flex-row items-center justify-between my-1 p-1 text-sm">
                <div>
                    <label class="mx-2">Buttons position</label>
                    <select v-model="slider[context].buttons_position">
                        <option value="top-0">top</option>
                        <option value="bottom-0">bottom</option>
                    </select>
                </div>
                <div class="text-sm" title="button background color">
                    <span class="font-bold">Btn Background</span>
                    <moka-bgcolor attr="bgcolor" v-model="slider[context].buttons_css" :css="slider[context].buttons_css"/>
                </div>
                <div class="text-sm" title="button text color">
                    <span class="font-bold">Btn Text</span>
                    <moka-color attr="textcolor" v-model="slider[context].buttons_text" :css="slider[context].buttons_text"/>
                </div>
                <!--<input type="text" v-model="slider[context].buttons_css" placeholder="class"/>-->
            </div>
            </div>
        </div>
        <div class="nuxpresso-modal w-full p-2" v-if="icon">
            <i class="material-icons absolute top-0 right-0 m-1" @click="icon=!icon">close</i>
            <!--<moka-select-icon v-model="slider[context].navigation.icons[iconIndex]" />-->
        </div>
    </div>
</template>

<script>
import MokaSelectIcon from '@/components/blocks/actions/block.customize.icon'
import MokaColor from '@/components/blocks/editor/tailwind/controls/tailwind.color'
import MokaBgcolor from '@/components/blocks/editor/tailwind/controls/tailwind.bgcolor'
import { mapState } from 'vuex'
export default {
    name: 'MokaSliderSettings',
    components: { MokaSelectIcon , MokaColor , MokaBgcolor },
    data:()=>({ 
        iconSelect: false,
        icon: null,
        iconIndex: null,
        slider: null,
        fullscreen: false,
        keyframes: false,
        context: 'controls'
    }),
    computed:{
        ...mapState ( ['editor'] ),

    },
    watch:{
        fullscreen(v){
            v ? this.slider.css = this.$clean ( this.slider.css + ' whoobe-fullscreen-gallery ' ) : this.slider.css = this.$clean(this.slider.css.replace('whoobe-fullscreen-gallery',''))
        }
    },
    methods: {
        setIcon(icon){
            this.slider[this.context].navigation.icons[this.iconIndex] = icon
        }
    },
    mounted(){
        this.slider = this.editor.current
    }
}
</script>