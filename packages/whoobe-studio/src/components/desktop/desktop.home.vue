<template>
    <div class="theme-dark min-h-screen pl-10 pt-10">
        <h3>Whoobe Landing Pages Templates <chip class="text-sm" content="Show Intro" @click="viewIntro()"></chip></h3>
        <blocks-gallery :objects="templates" mode="home" class="m-auto" v-if="templates"/>
        <!-- <whoobe-intro v-if="$store.state.user.intro"/> -->
        <!-- <modal
            v-if="index===0"
            size="md"
            position="modal"
            @close="index=null"
            buttons="none">
            <div slot="title">Welcome to Whoobe</div>
            <div slot="content" class="p-8 bg-gray-400 text-gray-800 text-lg">
                <p>
                    Whoobe Landing Pages Visual Builder is a browser application to create, change and publish landing pages without coding.
                </p>
                <p class="mt-4">
                    <chip content="Take a tour" @click="index++"/> or just <span class="w-auto bg-purple-500 text-white rounded py-1 px-2 cursor-pointer" @click="intro=!intro">select template</span>
                </p>
            </div>
        </modal>
        <transition name="fade">
        <modal
            v-if="index===1"
            css="m-12"
            size="md"
            position="modal-top-left"
            @close="index=null"
            buttons="none">
            <div slot="title">Navigation Bar</div>
            <div slot="content" class="p-8 bg-gray-400 text-gray-800 text-lg">
                <p class="relative pl-8">
                    <icon  name="chevron_left" class="absolute top-0 left-0 -ml-6 bg-white rounded-full p-2 z-highest text-xl"/> From the Navigation Bar you can access to all the application tools to manage your projects.<br>
                    <br>
                    <chip content="Next" @click="intro++"/>
                </p>
            </div>
        </modal>
        </transition> -->
        <!-- <h3 class="items-center flex">Projects<button class="ml-2 lg" @click="gallery=!gallery">Add new</button> <button class="lg ml-2">Create a page</button></h3>-->
        <div class="grid md:grid-cols-2 lg:grid-cols-5 text-purple-500 grid-cols-1 pl-10 absolute bottom-0 gap-10" v-if="projects">
            <!--<template v-for="project in projects">
                <div class="h-56 bg-top bg-cover bg-no-repeat shadow-lg flex items-end cursor-pointer"  :style="'background-image: url(' + $imageURL(project.component.image) + ');'"  @click="$store.dispatch('project',project),$action('project_edit')">
                    <div class="text-base bg-black w-full flex flex-row p-2 bg-opacity-75 cursor-pointer items-center">
                        <icon name="view_quilt" class="text-3xl"/>
                        <div class="p-2 text-sm">{{ project.name }}</div>
                    </div>
                </div>
            </template>
            
            <modal
                v-if="gallery"
                size="md"
                position="modal-top-left"
                buttons="none"
                @close="gallery=!gallery">
                <div slot="title">Select a block</div>
                <div slot="content">
                    <block-gallery-selection @component="createProject"/>
                </div>
            </modal> -->
            <!--
            <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/architectu_bw.webp') + ');'">
                <div class="text-xl bg-black w-full flex flex-row p-2 bg-opacity-75 cursor-pointer items-center" @click="$action('component_create')">
                    <icon name="view_quilt" class="text-3xl"/>
                    <div class="p-2">Create a block</div>
                </div>
            </div>
            <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/laptop_bw.webp') + ');'">
                <div class="text-xl bg-black w-full flex flex-row p-2 bg-opacity-75 cursor-pointer items-center"  @click="$action('articles_create')">
                    <icon name="article"/>
                    <div class="p-2">Create article</div>
                </div>
            </div>
            
            <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/technology_bg_001.webp') + ');'">
                <div class="text-xl bg-black w-full flex flex-row p-2 bg-opacity-75 cursor-pointer items-center" @click="openMedia()" >
                    <icon name="collections" class="text-3xl"/>
                    <div class="p-2">Manage Media</div>
                </div>
            </div>
            <div class="h-64 bg-center bg-cover bg-no-repeat shadow-lg flex items-end" :style="'background-image: url(' + this.$imageURL('/uploads/laptop_1205256_1920_d809b836cf.jpg') + ');'">
                <div class="text-xl bg-black w-full flex flex-row p-2 bg-opacity-75 cursor-pointer items-center" >
                    <icon name="help" class="text-3xl"/>
                    <div class="p-2">Documentation</div>
                </div>
            </div>
            -->
           
        </div>
        <!-- <block-wizard/> -->
    </div>
</template>

<script>
export default {
    name: 'DesktopHome',
    components: {
        'block-gallery-selection' : () => import ( '@/components/blocks/actions/block.gallery.selection.vue' ),
        'blocks-gallery' : () => import ( '@/components/blocks/blocks.gallery.vue' )
        // 'block-wizard' : () => import ( './desktop.wizard.vue' )
    },
    data:()=>({
        index:0,
        intro: true,
        gallery: false,
        projects: null,
        icons: null,
        templates: null,
        project:   {
            "name": "",
            "dist": "dist",
            "uploads": [],
            "fonts": [],
            "url": "http://localhost:3030/",
            "images": null,
            "mode" : "single",
            "component" : "null",
            "purge" :[],
            "analytics": "",
            "landing" : ""
        }
    }),
    methods: {
        viewIntro(){
            this.$store.dispatch('intro',1)
        },
        createProject(component){
            this.gallery = false
            this.project.component = component
            this.project.name = component.name
            this.project = this.$projectResources ( this.project )
            this.$api.service ( 'projects' ).create ( this.project ).then ( res => {
                this.projects.unshift( res )
            })
        },
        openMedia(){
            this.$mapState().desktop.tabs.push ( 
                {
                    component: 'media/media.vue',
                    name: 'Media',
                    filter: '',
                    mode: 'media',
                    icon: 'photo',
                    blocks: null
                }
            )
        }
    },
    mounted(){
        this.$api.service ( 'projects' ).find ().then ( res => {
            this.projects = res.data
        })
        this.$api.service ( 'components' ).find ( { query : { category: 'template' , $limit: 100 } } ).then ( res => {
            this.templates = res.data
        })
            // let tab = 
            //     {
            //         component: () => import ( '@/components/blocks/blocks.vue' ) ,
            //         name: 'Templates' ,
            //         icon: 'widgets',
            //         filter: 'template'  ,
            //         mode: 'templates',
            //         plugin: null,
            //         resumeAction: null,
            //         blocks: null
            //     }
            // //}) 
            // this.$store.dispatch ( 'mode' , tab.mode ) 
            // this.$store.dispatch ( 'add_tab' , tab )
            //this.desktop.currentTab = this.desktop.tabs.length - 1
            //window.localStorage.setItem('whoobe-desktop',JSON.stringify(this.desktop.tabs))
        
        
    }
}
</script>