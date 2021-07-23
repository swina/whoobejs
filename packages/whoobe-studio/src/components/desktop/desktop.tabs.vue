<template>
    <div class="fixed z-highest top-0 left-0 theme-dark whitespace-no-wrap flex flex-row flex-wrap cursor-pointer border-b border-gray-700 ml-10 desktop-tabs-container bg-gray-900" :class="displayMode">
        <div class="fixed top-0 left-0 h-10 w-10 text-center bg-purple-800 text-purple-300 flex items-center justify-center hover:text-white" @click="$emit('menu')" title="Menu">
            <icon name="menu"/>
        </div>
        <div class="h-10 w-10 text-center text-lime-300 flex items-center justify-center border-r border-gray-900 hover:bg-indigo-600" @click="$action('mode_settings')" :title="statusTitle">
            <icon-extra class="text-xl text-lime-500 hover:text-white" :icon="statusIcon"/>
        </div>
        <div v-for="(tab,index) in desktop.tabs" :key="tab.label" class="flex flex-row items-center pl-2 pr-1 border-r border-b h-10 border-gray-900 hover:text-white hover:bg-indigo-600" :class="active(index)" @click="desktop.currentTab=index,setMode(index),$action()">
            <div class="flex-row-center mr-2"><icon :name="tab.icon" class="mr-2"/><span class="capitalize">{{ tab.name }}</span></div>
            <icon name="close" class="text-xs ml-2 text-transparent hover:text-white" @click="removeTab(index),desktop.currentTab--"/>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'DesktopTabs',
    data:()=>({
        statusTitle:''
    }),
    computed: {
        ...mapState( ['desktop','editor'] ),
       displayMode(){
           return this.desktop.mode === 'editor' && this.editor.action != 'in_editor_preview' ? 'w-5/6' : 'w-full'
       },
       statusIcon(){
           if ( window.localStorage.getItem('whoobe-cms').includes('localhost') ){
               window.localStorage.setItem('whoobe-local',true)
               this.statusTitle = 'Local Development'
               return 'bx:bxl-dev-to'
           }
           this.statusTitle = 'Cloud Development'
           window.localStorage.setItem('whoobe-local',false)
           return 'mdi:cloud'
       }
    },
    methods: {
        active(index){

            return index === this.desktop.currentTab ? 'bg-indigo-700 text-white' : ''
        },
        removeTab ( index ){
            let tab = this.desktop.tabs[index]
            if ( tab.hasOwnProperty('mode') ){
                if ( tab.mode === 'block' ){
                    let confirm = window.confirm ( 'Save before to close ?')
                    if ( confirm ){
                        //save current component
                        let comp = this.$mapState().editor.component
                        this.$api.service ( 'components' ). patch ( comp._id , comp )
                            .then ( res => {
                                this.$message ( 'Save successfully!' )
                                this.editor.current = null
                                this.desktop.mode = null
                            })
                            .catch ( err => {
                                console.log ( err )
                                this.$message ( 'An error occurred.')
                            })
                    } else {
                        this.desktop.mode = null
                        this.editor.current = null
                    }
                }
            } 
                this.desktop.tabs.splice ( index , 1 )
                this.desktop.currentTab = this.desktop.tabs.length - 1
                console.log ( this.desktop.tabs.length )
                // this.desktop.tabs.length ? 
                //     this.$store.dispatch ( 'mode' , this.desktop.tabs[this.desktop.currentTab].mode ) : null
                window.localStorage.setItem('whoobe-desktop',JSON.stringify(this.desktop.tabs))
                this.$action()
            
        },
        setMode(index){
            if ( this.desktop.tabs.length && this.desktop.tabs[index] && this.desktop.tabs[index].hasOwnProperty('mode') )
                this.$store.dispatch('mode',this.desktop.tabs[index].mode)
        }
        
    },
    
    mounted(){
        
        //if ( window.localStorage.getItem('whoobe-desktop') ){
        //    this.$store.dispatch('tabs',JSON.parse(window.localStorage.getItem('whoobe-desktop')))
        //}
    }
}
</script>