
<template>
    <div class="flex flex-col theme-dark" v-if="current" :key="$randomID()">
        <!-- Element animation settings -->
        <div class="p-2">
            <label>Animation</label>
            <select class="dark w-full" v-model="editor.current.gsap.animation" @change="animate(editor.current,current.id)">
                <option value="">none</option>
                <option v-for="(ani,i) in gsapAnimations.gsapEffects" :value="ani.replace('-','')"><span class="capitalize">{{ ani.replace('-' , ' ')}}</span></option>
            </select>
            <label>Easing</label>
            <select class="dark w-full" v-model="editor.current.gsap.ease">
                <option value="">none</option>
                <option v-for="(ease,i) in gsapAnimations.gsapEase" :value="ease"><span class="capitalize">{{ ease.replace('.out','')}}</span></option>
            </select>
            <div class="grid grid-cols-2 gap-4 mt-2">
                <label>Duration (secs)</label>
                <input class="dark w-full" type="number" min=".1" max="100" step=".1" v-model="editor.current.gsap.duration"/>
                <label>Delay (secs)</label>
                <input class="dark w-full" type="number" min="0" max="100" step=".1" v-model="editor.current.gsap.delay"/>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <label>Trigger Over</label>
                <input class="dark w-full" type="checkbox" v-model="editor.current.gsap.trigger"/>
            </div>
            <div ref="aniDemo" class="text-center text-2xl my-4 bg-black w-1/2 text-gray-400 m-auto p-4">animation</div>
            <a href="#" @click="animate()">Run</a>
            <!-- <select class="dark w-full" v-model="$attrs.value.gsap.animation" @change="animate(current,current.id)">
                <option value="">none</option>
                <option v-for="(ani,i) in gsapAnimations.gsapEffects" :value="ani.replace('-','')"><span class="capitalize">{{ ani.replace('-' , ' ')}}</span></option>
            </select>
            <label>Easing</label>
            <select class="w-full " v-model="$attrs.value.gsap.ease">
                <option value="">none</option>
                <option v-for="(ease,i) in gsapAnimations.gsapEase" :value="ease"><span class="capitalize">{{ ease.replace('.out','')}}</span></option>
            </select>
            <label>Duration (secs)</label>
            <input class="dark w-full" type="number" min=".1" max="100" step=".1" v-model="$attrs.value.gsap.duration"/>
            <label>Delay (secs)</label>
            <input class="w-full" type="number" min="0" max="100" step=".1" v-model="$attrs.value.gsap.delay"/>
            <h1 ref="aniDemo" class="text-gray-800 m-auto p-10">DEMO</h1>
            <a href="#" @click="animate()">Run</a> -->
        </div>
    </div>
</template>

<script>

import gsap from 'gsap'
import gsapEffects from '@/scripts/animations'
import { mapState } from 'vuex'
export default {
    name: 'BlockAnimations',
    data:()=>({
        current: null
    }),
    //props: [ 'element' ],
    mounted(){  
        this.current = this.editor.current //this.$attrs.element
        !this.current.hasOwnProperty('gsap') ?
            this.current.gsap = {
                animation: '',
                ease: '',
                duration: 1,
                delay:0
            } :
            this.current.gsap = Object.assign ( {} , this.editor.current.gsap ) //this.$attrs.element.gsap )
    },
    watch: {
        
    },
    computed:{
        ...mapState ( ['editor'] ),
        gsapAnimations(){
            return gsapEffects
        }
    },
    methods: {
         animate(){
            if ( this.current.gsap && this.current.gsap.animation ){
                gsap.effects[this.current.gsap.animation]( this.$refs['aniDemo'] ,{
                    trigger: this.$refs['aniDemo'],
                    duration: parseFloat(this.current.gsap.duration) ,
                    ease: this.current.gsap.ease,
                    delay: parseFloat(this.current.gsap.delay)

                }) 
            }
            
        }
    }
}
</script>