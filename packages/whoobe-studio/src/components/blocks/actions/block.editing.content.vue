<template>
    <div class="w-full flex flex-col">
        <!-- image -->
        <!-- <div class="customizer-item" v-if="editor.current && editor.current.hasOwnProperty('image')" @click="setOpt('image'),image=!image">
            Media
        </div> -->
        <div class="p-2 text-center text-white border-b border-gray-700" v-if="editor.current && $has(editor.current,'image')">
            <image-placeholder 
                v-if="editor.current" 
                size="sm" 
                :image="editor.current.image" 
                @noimage="editor.current.image=null,editor.current.link=''" 
                @media="$action('media')"/> 
        </div>
        
        <!-- video options -->

        
        <!-- 
            <div class="cursor-pointer border-b hover:bg-black hover:text-white text-gray-800 px-1 mb-1" v-if="$attrs.element.type==='video' || $attrs.element.type === 'audio'" @click="setOpt('video')">
            Audio/Video Options
        </div>
        <transition name="fade">
            <div class="flex flex-col my-1 text-left" v-if="label==='video'">
                
                <div class="w-full flex flex-row justify-around">
                    <div>
                        <input type="checkbox" v-model="$attrs.element.options.autoplay"/> autoplay
                    </div>
                    <div>   
                        <input type="checkbox" v-model="$attrs.element.options.loop"/> loop 
                    </div>
                    <div>
                        <input type="checkbox" v-model="$attrs.element.options.controls"/> controls
                    </div>
                </div>
            </div>  
        </transition>
        -->
       
        <!-- link and anchor -->
        <!-- <div class="cursor-pointer border-b hover:bg-black hover:text-white text-gray-800 px-1" :class="label==='link'?'bg-orange-400 text-white ':' bg-gray-200'" @click="setOpt('link')">
            Link / Anchor
        </div>
        <transition name="fade">
            <div v-if="label==='link'" class="p-2 flex flex-col">
                <label>Link</label>
                <input class="w-full" type="text" v-model="$attrs.element.link"/>
                <label>Article/Page</label>
                <select class="w-full" v-model="$attrs.element.link">
                    <option v-for="(opt,o) in moka.articles" :value="'/' + opt.slug">{{ opt.title }}</option>
                </select>
                <label>Anchor</label>
                <input class="w-full" type="text" v-model="$attrs.element.anchor"/>
            </div>

            <div class="flex flex-col my-1 text-left" v-if="$attrs.component.category==='slider'">
                <label>Slide name</label>
                <input type="text" class="w-full" v-model="editor.current.name"/>
                <label>Slider Action</label>
                <select class="w-full" v-model="$attrs.element.action">
                    <option value=""></option>
                    <option value="slider_next">Next</option>
                    <option value="slider_prev">Prev</option>
                </select>
            </div>
        </transition> -->

        <!-- icon options -->

        <div class="bg-gray-800 cursor-pointer border-b border-gray-700 hover:bg-gray-700 hover:text-white text-gray-400 p-1 mb-0 text-xs" v-if="$attrs.element.tag==='icon' || $attrs.element.tag === 'icon_bt'" @click="setOpt('icon')">
            Icon <i class="material-icons absolute right-0 mr-2">chevron_right</i>
        </div>
        <!-- icon settings -->
        <transition name="slideright">
            <div v-if="label==='icon'" class="flex flex-col h-full text-gray-500 bg-gray-800 w-full absolute top-0 right-0 z-2xtop">
                <div class="bg-orange-400 text-black  flex flex-row p-1 items-center capitalize" @click="label=''"><i class="material-icons absolute right-0">chevron_right</i>Icon</div>
                <icons 
                    v-if="label==='icon'" 
                    :tag="$attrs.element.tag" 
                    :icon="$attrs.element.content" 
                    v-model="$attrs.element.content"/>
            </div>
        </transition>
        <!-- popup -->
        <div v-if="$attrs.element.hasOwnProperty('popup')" class="flex flex-col">
            <div class="bg-gray-200 cursor-pointer border-b hover:bg-black hover:text-white text-gray-900 px-1" @click="setOpt('popup')"><label>Modal Popup</label></div>
            <div class="flex flex-col" v-if="label==='popup'">
                <div>
                    <input class="mr-2" type="checkbox" v-model="$attrs.element.popup.close"/>
                    <label>Close icon</label>
                </div>
                <div>
                    <input class="mr-2" type="checkbox" v-model="$attrs.element.popup.cookie"/>
                    <label>Cookie enable</label>
                </div>
                <label>Cookie name</label>
                <input class="" type="text" v-model="$attrs.element.popup.cookie_name"/>
                <label>Delay</label>
                <input class="" type="number" min="0" max="1000" v-model="$attrs.element.popup.delay"/>
                <label>Anchor trigger</label>
                <input type="text" v-model="$attrs.element.popup.trigger"/>
            </div>
        </div>

        <!-- form field -->
        <div v-if="$attrs.element.tag === 'input'" class="flex flex-col">
            <div class="bg-gray-200 cursor-pointer border-b hover:bg-black hover:text-white mb-1 text-gray-800 px-0" @click="setOpt('formfield')"><label>Field/Button</label></div>
            <div class="flex flex-col" v-if="label==='formfield'">
                <label>Default value</label>
                <input class="w-full" type="text" v-model="$attrs.element.content"/>
                <label>Field name</label>
                <input class="w-full" type="text" v-model="$attrs.element.name"/>
                <label>Placeholder</label>
                <input class="w-full" type="text" v-model="$attrs.element.placeholder"/>
                <label>Required</label>
                <input type="checkbox" v-model="$attrs.element.required"/>
                <!-- button action -->
                <div v-if="$attrs.element.element === 'button'" class="flex flex-col">
                    <label>Action</label>
                    <input class="w-full" type="text" v-model="$attrs.element.action"/>
                </div>
            </div>
        </div>

        <!-- <div class="bg-gray-200 cursor-pointer border-b hover:bg-black hover:text-white text-gray-800 px-1 mt-0" v-if="editor.current && editor.current.tag != 'document'" @click="setOpt('semantic'),semantic=!semantic">
            HTML Semantic
        </div>
        <moka-options 
            class="mb-0" 
            v-if="label==='semantic'" 
            attr="semantics" 
            v-model="editor.current.semantic" 
            :css="editor.current.semantic"/> -->
        

       
    </div>
</template>

<script>
import ImagePlaceholder from '@/components/blocks/editor/components/block.image.placeholder'
import Icons from './block.customize.icon'
import { mapState }  from 'vuex'
export default {
    name: 'MokaEditContent',
    data:()=>({
        semantic: false,
        image: false,
        video: false,
        link: false,
        icon: false,
        formfield: false,
        popup:false,
        label: '',
    }),
    components: { ImagePlaceholder , Icons },
    computed:{
        ...mapState ( ['moka','editor'] )
    },
    methods:{
        setOpt(label){
            this.label===label ? this.label = '' : this.label = label
        }
    }

}
</script>