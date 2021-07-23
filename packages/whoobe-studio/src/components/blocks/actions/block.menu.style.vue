<template>
    <div class="w-full flex flex-col">
        <div class="flex flex-row">
            <button :class="tab('main')" @click="mode='main'">Main</button>
            <button :class="tab('submenu')" v-if="submenu" @click="mode='submenu'">Submenu/Dropdown</button>
            <button :class="tab('responsive')" v-if="editor.current.responsive" @click="mode='responsive'">Responsive</button>
        </div>
        <div class="flex flex-col p-4">
            <template v-for="classe in keys[mode]">
                
                <div class="flex-row-center">
                    {{ classe.label }} 
                    <icon class="ml-2" name="edit" @click="currentCSSKey=classe.key,customize=true"/>
                </div>
                <textarea v-model="editor.current.css[classe.key]" class="h-32 w-full text-black" @focus="cssCurrentKey=classe.key"/>    
                
            </template>
            Responsive
            <input type="checkbox" v-model="editor.current.responsive"/>
            <div v-if="editor.current.responsive && mode==='responsive'" class="flex flex-col">
                <div class="flex-row-center mb-2" @click="icon=!icon,iconType='burger'">
                    <icon-extra :key="icon" :icon="editor.current.icons.burger" class="p-1 rounded-full  border border-dashed mr-2 text-xl" title="Click to change" />
                    <!-- <icon :name="editor.current.icons.burger" class="p-1 rounded-full  border border-dashed mr-2" title="Click to change"/>  -->
                    Menu Icon 
                    
                </div>
                <div class="flex-row-center" @click="icon=!icon,iconType='back'">
                    <icon-extra :key="icon" :icon="editor.current.icons.back" class="p-1 rounded-full  border border-dashed mr-2 text-xl" title="Click to change" />
                    Close Icon
                </div>
            </div>
            <div v-if="mode==='submenu'" class="flex-row-center mt-2" @click="icon=!icon,iconType='submenu'">
                <icon-extra key="submenu_down" :icon="editor.current.icons.submenu" class="p-1 rounded-full  border border-dashed mr-2 text-xl" title="Click to change"/>
                Submenu/Dropdown Icon 
            </div>
        </div>
        <!--
        <div class="flex flex-col p-4" v-if="mode==='main'">
            <div class="flex-row-center">
                Main CSS <icon class="ml-2" name="edit" @click="currentCSSKey='css',customize=true"/>
            </div>
            <textarea v-model="editor.current.css.css" class="h-32 w-full text-black"/>

            <div class="flex-row-center">
                Items CSS <icon class="ml-2" name="edit" @click="currentCSSKey='items',customize=true"/>
            </div>
            <textarea v-model="editor.current.css.items" class="h-32 w-full text-black"/>
            Responsive
            <input type="checkbox" v-model="editor.current.responsive"/>
        </div>
        <div class="flex flex-col p-4" v-if="mode==='submenu'">
            <div class="flex-row-center">
                Submenu/Dropdown CSS <icon class="ml-2" name="edit" @click="currentCSSKey='submenu',customize=true"/>
            </div>
            <textarea v-model="editor.current.css.submenu" class="h-32 w-full text-black"/>

            <div class="flex-row-center">
                Submenu/Dropdown Items CSS <icon class="ml-2" name="edit" @click="currentCSSKey='submenu_items',customize=true"/>
            </div>
            <textarea v-model="editor.current.css.submenu_items" class="h-32 w-full text-black" @focus="cssCurrentKey='submenu_items'"/>
        </div>
        <div class="flex flex-col p-4" v-if="mode==='responsive'">
            <div class="flex-row-center">
                Responsive CSS <icon class="ml-2" name="edit" @click="currentCSSKey='responsive',customize=true"/>
            </div>
            <textarea v-model="editor.current.css.responsive" class="h-32 w-full text-black" @focus="cssCurrentKey='responsive'"/>

            <div class="flex-row-center">
                Responsive Items CSS <icon class="ml-2" name="edit" @click="currentCSSKey='responsive_items',customize=true"/>
            </div>
            <textarea v-model="editor.current.css.responsive_items" class="h-32 w-full text-black" @focus="cssCurrentKey='responsive_items'"/>
        </div>
        -->
        <transition name="fade">
            <modal 
                @close="icon=!icon"
                size="sm"
                position="modal-top-right"
                buttons="none"
                v-if="icon">
                <div slot="title">Icon</div>
                <block-iconify slot="content" @icon="setIcon"/>
            </modal>
        </transition>
        <transition name="slideright">
             <modal 
                @close="customize=!customize"
                size="sm"
                buttons="none"
                position="modal-top-right"
                v-if="customize">
                <div slot="title">Customize Menu {{currentCSSKey}}</div>
                <block-tailwind slot="content" mode="menu" :cssKey="currentCSSKey" :css="css" @css="setCSS"/>
             </modal>
        </transition>
    </div>
</template>

<script>
import { mapState } from 'vuex'
 
export default {
    name: 'BlockMenuStyle',
    components: {
        'block-iconify'       : () => import ( './block.iconify.vue' ),
        'block-tailwind'    : () => import ( '@/components/blocks/editor/tailwind/tailwind.container.vue'),
    },
    data:()=>({
        mode: 'main',
        customize: false,
        icon: false,
        iconType: 'burger',
        currentCSSKey: 'css',
        css: '',
        keys : {
            main: [
                { label: 'Menu CSS' , key: 'css' },
                { label: 'Menu Items CSS' , key: 'items' },
            ],
            submenu: [
                { label: 'Submenu/Dropdown CSS' , key: 'submenu' },
                { label: 'Submenu/Dropdown Items CSS' , key: 'submenu_items' },
            ],
            responsive: [
                { label: 'Responsive CSS' , key: 'responsive' },
                { label: 'Responsive Items CSS' , key: 'responsive_items' },
            ]
        }
    }),
    computed:{
        ...mapState ( ['editor'] ),
        submenu(){
            return this.editor.current.blocks.length
        }
    },
    watch:{
        currentCSSKey(v){
            this.css = this.editor.current.css[v]
        }
    },
    methods:{
        tab(mode){
            return this.mode === mode ? 'bg-purple-800' : 'bg-gray-900'
        },
        setIcon(icon){
            console.log ( icon, 'type=>' , this.iconType )
            this.editor.current.icons[this.iconType] = icon
            console.log ( this.editor.current.icons[this.iconType])
            this.icon = false
        },
        setCSS(css){
            console.log ( css , this.currentCSSKey )
            //this.editor.current.css[this.currentCSSKey] = css
        }
    },
    mounted(){
        this.css = this.editor.current.css.css
    }
}
</script>