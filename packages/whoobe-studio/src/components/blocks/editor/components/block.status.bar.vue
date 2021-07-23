<template>
    <div class="fixed bottom-0 left-0 pl-2 w-superwide theme-dark flex flex-row items-center h-10 text-gray-300 p-1 z-highest flex flex-row items-center border-t border-gray-700">
        <div class="flex flex-row items-start ml-8">
        
        <div class="h-10 w-10 border-r border-l border-gray-900 flex flex-row items-center justify-center hover:bg-black" @click="$action('component_settings')">
            <!-- @click="docOptions=!docOptions"-->
            <!-- <icon name="more_vert" class="text-orange-400" title="Options"/> -->
            <icon name="settings" class="text-orange-400" title="Options"/>
        </div>
        
        <!-- <i class="material-icons text-orange-400" title="Document">description</i> -->


        <!-- CLEAR SELECTION -->
        <div class="h-10 w-10 border-r border-gray-900 flex flex-row items-center justify-center hover:bg-black" @click="$store.dispatch('setCurrent',doc),$store.dispatch('selected',doc.id)">
            <icon name="border_clear" class="text-gray-300 hover:text-indigo-500" title="Select document"/>
        </div>


        <!-- ADD EMPTY BLOCK (GRID) -->
        <!-- <icon name="grid_on" v-if="editor.current && editor.current.tag==='document'" class="text-gray-300 hover:text-indigo-500" @click="$action('grids')" title="Add Grid"/> -->

        <!-- ADD ELEMENT -->
        <div v-if="editor.current && (editor.current.tag==='document' || editor.current.type === 'grid' || editor.current.type === 'flex')" class="h-10 w-10 border-r border-gray-900 flex flex-row items-center justify-center hover:bg-black" @click="$action('block_add_element')">
            <icon name="add"  class="text-gray-300 hover:text-indigo-500" title="Add block"/>
        </div>

        <!-- IMPORT A BLOCK -->
        <div  v-if="editor.current && (editor.current.tag==='document' || editor.current.type === 'grid' || editor.current.type === 'flex')" class="h-10 w-10 border-r border-gray-900 flex flex-row items-center justify-center hover:bg-black" @click="$action('addreusable'),addBlock=true">
            <icon name="widgets" class="text-gray-300 hover:text-indigo-500" title="Add reusable block"/>
        </div>

        <div class="ml-8 h-10 w-10 border-r border-l border-gray-900 flex flex-row items-center justify-center hover:bg-black" @click="openPreview()">
        <!-- PREVIEW IN A NEW WINDOW -->
            <icon name="preview" class="text-gray-300 hover:text-indigo-500" title="Preview in a new window"/>
        </div>
        <!-- PREVIEW DOCUMENT -->
        <div class="h-10 w-10 border-r border-gray-900 flex flex-row items-center justify-center hover:bg-black" @click="previewTab('laptop')">
            <icon name="laptop" class="text-gray-300 hover:text-indigo-500" title="Preview"/>
        </div>

        <div class="h-10 w-10 border-r border-gray-900 flex flex-row items-center justify-center hover:bg-black" @click="previewTab('mobile')">
            <icon name="smartphone" class="text-gray-300 hover:text-indigo-500" title="Preview"/>
        </div>

        <!-- PREVIEW SLIDER
        <i class="material-icons nuxpresso-icon-circle ml-2 text-gray-300 bg-green-400 " v-if="component && component.category==='slider'" title="Preview" @click="slider=!slider,disable=false">remove_red_eye</i>
         -->
        <!-- SAVE DOCUMENT -->
        <div class="h-10 w-10 border-r border-gray-900 flex flex-row items-center justify-center hover:bg-black" @click="savePage()">
            <icon name="save" class="hover:text-indigo-500 cursor-pointer" title="Save page"/><!--$action('savecomponent')-->
        </div>

        <div class="h-10 w-10 border-r border-gray-900 flex flex-row items-center justify-center hover:bg-black" @click="$store.dispatch('export','single'),$action('component_export')">
            <icon name="download" class="hover:text-indigo-500 cursor-pointer" title="Export"/><!--$action('savecomponent')-->
        </div>

        <!-- <i class="material-icons moka-icons nuxpresso-icon-circle text-gray-300 ml-2 divide-x divide-gray-200" @click="$action('savecomponent')"
title="Save document">save</i> -->
        </div>
        <!-- MENU OPTIONS -->
        
        

        <!-- <i class="material-icons text-gray-500 hover:bg-black hover:text-blue-400 mx-2" @click="help=!help" title="Hotkeys">keyboard</i> -->
        
        <div v-if="editor.current" class="lg:w-2/3 w-1/2 border-l border-gray-700 pl-4 mr-10 w-full flex text-sm flex-row items-center" :title="editor.current.id">
            
            <i class="material-icons text-sm mx-1" v-if="editor.current.icon">{{editor.current.icon}}</i>

            <span v-else>CONTAINER <i class="material-icons text-sm mx-1">select_all</i></span>

            <span class="capitalize ml-2 cursor-pointer" title="Edit CSS/Style" @click="$action('edit_css')">CSS</span>
            
            <input v-if="editor.current && !editor.current.css.hasOwnProperty('css')" type="text" class="dark bg-gray-900 ml-2 w-3/5 border-0 text-white rounded-none" v-model="editor.current.css"/>
            
            <input v-else type="text" class="dark ml-2 w-3/5 text-white border-0 rounded-none bg-gray-900" v-model="editor.current.css.css"/>

            <i class="material-icons moka-icons ml-2" title="Edit CSS classes" @click="$action('edit_css')">edit</i>
            <div class="flex flex-row bg-purple-600 text-white mx-2 h-5 rounded px-1 text-sm items-center" @click="$action('seo')">SEO</div>
            <!-- <div v-if="editor.current.coords" class="absolute right-0 mr-1 text-xs md:text-sm text-gray-600 p-1">
                {{ editor.current.coords.width.toFixed(2) }} x {{ editor.current.coords.height.toFixed(2) }} |
                x: {{ editor.current.coords.x.toFixed(2) }} y: {{ editor.current.coords.y.toFixed(2) }}
            </div> -->
            <!--
            <i class="material-icons moka-icons ml-2" title="Customize" @click="$action('customize')">brush</i>
            <i class="material-icons moka-icon-circle ml-2" title="Preview in new window" @click="openPreview()">preview</i>
            -->
        </div>

        <div class="flex flex-col fixed bottom-0 left-0 ml-10 mb-10 theme-dark w-1/3 lg:w-1/4 cursor-pointer z-2xtop opacity-100" v-if="docOptions" @mouseleave="docOptions=!docOptions">
                <!-- createPage=!createPage -->
            <div class="p-1 hover:bg-gray-900" @click="$action('component_createpage')">Create article</div>
            <div class="p-1 hover:bg-gray-900" @click="editor.export='single',$action('component_export')">Export</div>
            <div class="p-1 hover:bg-gray-900" @click="$action('component_settings')">Settings</div>
        </div>
        
    </div>
</template>

<script>
import jp from 'jsonpath'
export default {
    name: 'WhoobeEditorStatusBar',
    data:()=>({
        docOptions: false
    }),
    computed:{
        doc(){
            return this.$mapState().editor.component.json
        },
        component(){
            this.$mapState().editor.component = this.$attrs.component 
            return this.$attrs.component //this.$mapState().editor.component.json
        },
        editor(){
            return this.$mapState().editor
        }
    },
    methods:{
        savePage(){
            //this.$loading ( true )
            let component = this.editor.component
            window.localStorage.setItem('whoobe-component',JSON.stringify(component) )
            delete component.autosave
            component.blocks_id ?
                component.blocks_id === component.json.id ?
                    null :
                        component.blocks_id = component.json.id 
                            : component.blocks_id = component.json.id
            // let project = {
            //     component: component
            // }
            let project = this.$buildOptions(component)
            component.links.forEach ( slug => {
                if ( slug.length > 2){
                    let art = this.$mapState().datastore.dataset.articles.filter ( article => article.slug === slug.replace('/','') )
                    if ( !art.length ){
                        console.log ( slug , ' page not found!')
                        let noLink = jp.query ( component.json , '$..blocks[?(@.link=="' + slug + '")]' )
                        if ( noLink.length ){
                            noLink[0].link = ''
                        }
                        console.log ( noLink )
                    }
                }
            })
            console.log ( component )

            this.$api.service ( 'resources' ).create ( { project : project } )
                .then ( purge => {
                    component.purge = purge.sort()                 
                    this.$saveComponent ( component ).then ( res => {
                        this.$loading(false)
                        this.$message('Block saved')
                        this.$action()
                        console.log ( res )
                    }).catch ( err => {
                        this.$loading(false)
                        this.$message('An error occured. Check you console log.')
                        this.$action()
                        console.log ( err )
                    })
            })
        },
        openPreview(){
            this.$mapState().editor.preview = this.component
            window.localStorage.setItem('whoobe-preview',JSON.stringify(this.doc))
            //)
            window.localStorage.setItem('whoobe-component',JSON.stringify(this.editor.component))
            window.localStorage.setItem ( 'whoobe-preview-id' , this.editor.component._id )
            let route = this.$router.resolve({path: '/preview'});
            let w = window.open(route.href, 'whoobe','width=' + window.screen.availWidth );
            w.focus()
        },
        previewTab(mode){
            this.$mapState().editor.component = this.component
            if ( mode === 'mobile' ){
                window.localStorage.setItem('whoobe-preview',JSON.stringify(this.doc))
                window.localStorage.setItem('whoobe-component',JSON.stringify(this.component))
                this.$mapState().editor.preview_mobile = true
            } else {
                this.$mapState().editor.preview_mobile = false
            }
            this.$action('in_editor_preview')
            /*
            this.$mapState().editor.preview = this.component
            this.$mapState().desktop.tabs.push ( {
                component: () => import ( '@/components/moka/editor/preview/whoobe.preview' ),
                name: this.component.name + ' Preview' ,
                icon: 'preview',
                filter: '',
                mode: 'preview',
                ref: this.$randomID(),
                resumeAction: null,
                blocks: this.component.json.blocks[0],
            })
            */
        }

    }
}
</script>
