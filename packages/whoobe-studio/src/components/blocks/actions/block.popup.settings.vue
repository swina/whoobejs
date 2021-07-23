<template>
    <div class="text-sm theme-dark p-2">
            <div class="flex flex-col text-sm">
                <div class="grid grid-cols-5 gap-2">
                    <div class="col-span-5 flex justify-between flex-row items-center">
                        <label class="mr-2">Name</label>
                        <input class="dark" type="text" v-model="editor.current.popup.name"/>
                        <label class="mx-1">Position</label>
                        <select class="dark" v-model="editor.current.popup.position">
                            <option value="">center</option>
                            <option value="-top">top</option>
                            <option value="-top-left">top left</option>
                            <option value="-top-right">top right</option>
                            <option value="-bottom">bottom</option>
                            <option value="-bottom-left">bottom left</option>
                            <option value="-bottom-right">bottom right</option>
                        </select>
                    </div>
                    
                </div>
                <div class="col-span-5 my-4 flex flex-row">
                        <input type="checkbox" v-model="editor.current.popup.close" class="mr-2"><label>Close icon</label>
                    </div>
                <!--
                <div class="flex flex-row">
                    <input type="checkbox" v-model="editor.current.popup.close" class="mr-2"><label>Close icon</label>
                </div>
                -->
                <div v-if="editor.current.popup.close" class="p-2 bg-gray-700">
                    <div class="grid grid-cols-2">
                        <div class="flex flex-col">
                            <label class="font-bold cursor-pointer">Icon color</label>
                            <moka-color attr="textcolor" v-model="editor.current.popup.css.close_color" :css="editor.current.popup.css.close_color"/>
                        </div>
                        <div class="flex flex-col">
                            <label class="font-bold">Size</label>
                            <select class="dark" v-model="editor.current.popup.css.close_size">
                                <option v-for="size in textSizes" :value="size">{{ size.replace('text-','') }}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row my-2">
                    <input type="checkbox" v-model="editor.current.popup.modal" class="mr-2"><label>Modal</label>
                </div>
                <div v-if="editor.current.popup.modal" class="bg-gray-700 p-2">
                    <div class="grid grid-cols-2">
                        <div class="flex flex-col">
                            <label class="font-bold cursor-pointer">Modal Background</label>
                            <moka-bgcolor attr="bg" v-model="editor.current.popup.css.modal_background" :css="editor.current.popup.css.modal_background"/>
                        </div>
                        <div class="flex flex-col">
                            Opacity
                            <input type="range" min="0" max="100" step="25" class="w-full" v-model="editor.current.popup.css.modal_opacity"/>    
                        </div>
                    </div>
                    </div>
                </div>
                <label>Trigger name</label>
                <input class="dark w-full sm" type="text" v-model="editor.current.popup.trigger"/>
                <div class="flex flex-row my-4">
                    <input type="checkbox" v-model="editor.current.popup.cookie" class="mr-2"><label>Cookie disable</label>
                </div>
                <div v-if="editor.current.popup.cookie" class="grid grid-cols-2 gap-3">
                    <div>
                        <label>Cookie Name</label>
                        <input class="w-full sm" type="text" v-model="editor.current.popup.cookie_name"/>
                    </div>
                    <div class="flex flex-col">
                        <label>Cookie expires (days)</label>
                        <input class="w-full sm" type="number" min="0" max="100" v-model="editor.current.popup.cookie_expires"/>
                    </div>
                </div>
                <div class="my-2">
                    <label>Delay secs. <i>(show after)</i></label>
                    <input class="w-full sm p-0 pl-1" type="number" min="0" max="100" v-model="editor.current.popup.delay"/>
                </div> 
                <div class="flex flex-row" v-if="!editor.current.popup.cookie">
                    <input type="checkbox" v-model="editor.current.popup.single"><label>Single impression</label>
                </div>
                <!--<button class="success m-auto w-12 my-2" @click="$emit('click')">OK</button>-->
            </div>
    </div>
</template>
<script>
import MokaColor from '@/components/blocks/editor/tailwind/controls/tailwind.color'
import MokaBgcolor from '@/components/blocks/editor/tailwind/controls/tailwind.bgcolor'
import classes from '@/scripts/tw.classes'
import { mapState } from 'vuex'
export default {
    name: 'MokaPopupSettings',
    data:()=>({
        textSizes: null
    }),
    props:[ 'id' ],
    components: {
        MokaColor , MokaBgcolor
    },
    computed: {
        ...mapState ( [ 'editor' ] ),
        isopen(){
            this.id != this.editor.current.id ? this.$action() : null
            return null
        }
    },
    mounted(){
        this.textSizes = classes.textSize
    }
}
</script>