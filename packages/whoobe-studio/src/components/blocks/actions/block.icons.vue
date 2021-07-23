<template>
    <div :data="init" class="p-2 theme-dark h-screen">
        <!-- material icons -->
        <div v-if="$attrs.type==='material'" class="flex flex-col">
            Material Icons
            <i class="material-icons m-auto p-2 border" v-if="$attrs.name">{{ $attrs.name }}</i>
            <div class="text-xs text-center">{{ editor.current.content }}</div>
            <input type="text" class="w-full text-black" v-model="search" @keyup="iconSearch" placeholder="search icon"/>
            Icon Category
            <select class="w-full text-black" v-if="!search"  v-model="groupicon">
                <option v-for="(group,i) in Object.keys(icons)" :value="group">{{ group }}</option>
            </select> 
            <div class="flex flex-row flex-wrap overflow-y-auto h-3/5" v-if="!search && groupicon">
                <i v-for="(icon,n) in icons[groupicon]" class="flex flex-row flex-wrap material-icons cursor-pointer m-1 text-xl" @click="setIcon(icon)" :title="icon">{{ icon }}</i>
            </div>
            <div v-if="search.length > 2 && searchIcons" class="flex flex-row flex-wrap overflow-y-auto h-3/5">
                <i v-for="(icon,n) in searchIcons" class="flex flex-row flex-wrap material-icons cursor-pointer m-1 text-xl" @click="setIcon(icon)" :title="icon">{{ icon }}</i>
            </div>
        </div> 
        <!-- bootstrap icons -->
        <div v-if="$attrs.type==='bootstrap'" class="flex flex-col">
            Bootstrap Icons
            <input type="text" placeholder="search icon" v-model="bt_icon_search"/>
            <div class="cursor-pointer flex mt-2 flex-row px-1 bg-white items-start flex-wrap overflow-y-auto" style="" v-if="bt_icons">
                <template v-for="icon in bt_icons_found">
                    <i :class="'bi-' + icon + ' text-xl m-1 float-left'" :title="icon" @click="setIcon(icon)"></i>
                </template>
            </div>
            <div class="flex flex-row cursor-pointer justify-center">
                <i class="bi-caret-left-fill" @click="bt_start=bt_start-100" v-if="bt_start>0"></i>
                <i class="bi-caret-right-fill" @click="bt_start=bt_start+100"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import booticons from '@/scripts/bootstrap.icons'
import icons from '@/scripts/icons'
export default {
    name: 'MokaSelectIcon',
    data:()=>({
        groupicon:'',
        allIcons: null,
        search: '',
        searchIcons: null,
        icons: null,
        bt_icons: null,
        bt_icon_search:'',
        bt_icons_found:null,
        bt_start: 0
    }),
    mounted(){
        this.icons = icons.icons
        this.bt_icons = booticons
        this.bt_icon_search = this.editor.current.content 
        this.populateIcons()
    },
    computed:{
        ...mapState( ['editor'] ),
        init(){
            this.icons = icons.icons
            this.allIcons = Object.values(icons.icons).join(',').split(',')

        }
    },
    watch:{
        search(v){
            this.iconSearch()
        },
        bt_icon_search(v){
            if ( v ){
                this.bt_icons_found = this.bt_icons.filter ( icon => icon.includes(v) )
            } else {
                this.bt_start = 0 
                this.populateIcons()
            }
        },
        bt_start(v){
            this.populateIcons()
        }
    },
    methods:{
        populateIcons(){
            this.bt_icons_found = []
            for ( var n = this.bt_start ; n < (this.bt_start+100) ; n++){
                this.bt_icons_found.push ( this.bt_icons[n] )
            }
        },
        iconSearch(){
            if ( this.search.length > 1 ){
                this.searchIcons = this.allIcons.filter( icon => icon.indexOf( this.search ) > -1 )
            }
        },
        setIcon(icon){
            this.$emit('icon',icon)
        }
    }
}
</script>
