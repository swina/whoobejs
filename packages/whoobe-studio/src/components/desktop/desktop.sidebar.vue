<template>
    <div class="fixed z-top top-0 left-0 h-screen w-10 theme-dark flex flex-col items-start justify-start pt-10 border-r border-purple-900">
        <div v-for="item in menu.items" class="h-10 w-10 mb-2 flex flex-col items-center justify-center hover:text-gray-200 hover:bg-indigo-700 cursor-pointer relative" :title="item.label" @mouseover="label=item.label" :key="item.label" @click="addTab(item)">
            <icon :name="item.icon" :label="item.label.substring(0,8)"/>
            <div v-if="item.items && label===item.label" class="absolute top-0 left-0 ml-10  z-highest w-48 bg-gray-900 flex flex-col" @mouseleave="label=null">
                <div class="bg-black p-1">{{ item.label }}</div>
                <div v-for="sub in item.items" :key="sub.label" @click="addTab(sub)">
                    <div class="border-l-4 border-transparent hover:border-indigo-700 hover:bg-gray-700 p-1 hover:text-gray-200 capitalize">{{ sub.label }}</div>
                </div>
            </div>
            <div v-if="item.dataset && label===item.label" class="absolute top-0 left-0 ml-10  z-highest w-48 bg-gray-900 flex flex-col" @mouseleave="label=null">
                <div class="bg-black p-1">{{ item.label }}</div>
                <div v-for="sub in datastore[item.dataset]" :key="sub.label" @click="addTab(sub),label=null">
                    <div class="border-l-4 border-transparent hover:border-indigo-700 hover:bg-gray-700 p-1 hover:text-gray-200 capitalize">{{ sub.label }}</div>
                </div>
            </div>
        </div>
        <template v-for="plugin in datastore.dataset.plugins">
            <div v-if="plugin.general.help" class="h-10 w-10 mb-2 flex flex-col items-center justify-center hover:text-gray-200 hover:bg-indigo-700 cursor-pointer relative" :title="plugin.general.name" :key="plugin.general.name" @mouseover="label=plugin.general.name" @click="addPluginTab(plugin)">
                <icon :name="plugin.general.version"/>
            </div>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Menu from '@/scripts/app.js'
export default {
    name: 'DesktopSidebar',
    data:()=>({
        label: ''
    }),
    computed:{
        ...mapState ( [ 'desktop','datastore' ] ),
        menu(){
            return Menu
        },
      
    },
    methods:{
        addTab ( item  ){
            if ( !item.path ) return 
            
            //this.desktop.tabs.push ( {
            let tab = 
                {
                    component: item.path ,//() => import ( '@/components/' + compName ) ,
                    name: item.label ,
                    icon: item.icon ? item.icon : parent ? parent.icon : null,
                    filter: item.filter  ,
                    mode: item.label.toLowerCase(),
                    plugin: null,
                    resumeAction: null,
                    blocks: null
                }
            //}) 
            this.$store.dispatch ( 'mode' , tab.mode ) 
            this.$store.dispatch ( 'add_tab' , tab )
            //this.desktop.currentTab = this.desktop.tabs.length - 1
            window.localStorage.setItem('whoobe-desktop',JSON.stringify(this.desktop.tabs))
       },
       addPluginTab ( item ){
            if ( !item.component.config.menu ) return 
            this.desktop.tabs.push ( {
                component: 'plugins/' + item.component.config.menu ,
                name: item.general.name ,
                icon: item.general.version ? item.general.version : 'extension',
                filter: ''  ,
                mode: item.general.name.toLowerCase(),
                plugin: item,
                resumeAction: null,
                blocks: null,
            })  
            this.desktop.currentTab = this.desktop.tabs.length - 1
            window.localStorage.setItem('whoobe-desktop',JSON.stringify(this.desktop.tabs)) 
       }
    }
}
</script>

