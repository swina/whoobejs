<template>
    <div class="w-full h-4/5 text-gray-500">
        
        <div class="bg-purple-500 p-4 animate-pulse text-center text-white text-xl" v-if="resources">
            Loading project resources ...
        </div>

        <div class="flex flex-row items-center border-b border-black">
            <button class="lg border-r border-gray-900" @click="tab='project'">Settings</button>
            <button class="lg border-r border-gray-900" @click="tab='publish'">Publish</button>
        </div>

        
        <!-- <template v-for="project in $mapState().datastore.dataset.projects">
            <div :class="'cursor-pointer theme-dark border p-1 mt-1 ' + active(project)" @click="getProjectData(project)">{{ project.name }}</div>
        </template> -->
        <div v-if="tab==='project'">
        <div v-if="selected" class="w-full bg-gray-800 p-4 grid grid-cols-2 gap-10">
            <div class="flex flex-col">
                <label>Page/Block</label>
                <!-- <select class="dark w-full" v-model="selected.mode">
                    <option value="website">Website</option>
                    <option value="single">Single Page/Block</option>
                </select> -->
                <img :src="$imageURL(selected.component.image)" v-if="selected.component" class="m-auto h-40 w-32 object-cover object-top"/>
                <button class="m-auto" @click="selectComponent=!selectComponent" v-if="selected.mode==='single'">Select</button>
            </div>
            <div class="flex flex-col">
                <label>Name</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.name"/>
                <label>Google Analytics</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.analytics"/>
                <label>SEO Title</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.component.seo.title"/>
                <label>SEO Description</label>
                <textarea class="dark w-full text-sm" v-model="selected.component.seo.description"/>
            </div>
            <div class="flex flex-col">
                <label>CMS URL</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.url"/>
            
                <label>Destination folder</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.dist"/>
            
                <label>GIT Repo </label>
                <input type="text" class="dark w-full text-sm" v-model="selected.repo"/>
            </div>
            
            <!-- <div class="flex flex-col">
                <label>Google Analytics</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.analytics"/>
                <label>SEO Title</label>
                <input type="text" class="dark w-full text-sm" v-model="selected.component.seo.title"/>
                <label>SEO Description</label>
                <textarea class="dark w-full text-sm" v-model="selected.component.seo.description"/>
            </div> -->
            <div class="flex flex-col">
                <label>Fonts</label>
                <textarea class="dark w-full text-sm" v-model="selected.fonts"/>
                <label>Local Images {{ selected.uploads.length }}</label>
                <div class="flex flex-row flex-wrap relative h-40 overflow-y-auto">
                    <template v-for="image in selected.uploads">
                        <img :src="$imageURL(image)" class="w-10 h-10 mr-1 mb-1 object-cover object-top" @click="imagePreview=!imagePreview,imageZoom=$imageURL(image)"/>
                    </template>
                </div>
            </div>
            
            
            <div class="col-span-2 text-center" v-if="!resources">
                <button class="lg m-auto" @click="saveProject">Save</button>
            </div>

        </div>
        </div>
        <div v-if="tab==='publish'" class="flex flex-col p-4">
            <div class="flex flex-col justify-center items-center p-2">
                <!-- <icon name="web" class="m-auto rounded-full text-4xl text-gray-200 p-4 border" @click="tab='project'"/> -->
                <icon name="dynamic_form" class="m-auto rounded-full text-4xl text-gray-200 p-4 border" @click="output='Collecting resources ...',publish()"/>
                <div>
                    <input type="checkbox" v-model="commit"> Commit &amp; Deploy
                </div>
                <div v-if="hasStore">
                    <input type="checkbox" v-model="selected.store"/> Include store data
                </div>
                <button @click="publish()">Click here to publish</button>
                <icon v-if="resources" name="bubble_chart" class="animate-spin"/>
            </div>
            <div class="grid grid-cols-3 gap-10">
                <textarea id="generated" v-model="output" style="font-family:monospace" class="text-sm w-full h-64 bg-black text-green-500 font-light col-span-2">
                </textarea>
                <textarea id="generated_errors" v-model="errors" style="font-family:monospace" class="text-sm w-full h-64 border-red-500 bg-black text-red-400"></textarea>
            </div>
            <div class="bg-purple-500 p-4 animate-pulse text-center text-xl" v-if="done && !errors">
                {{ done }}
                <button @click="preview">Preview</button>
            </div>
            <div class="bg-red-600 p-4 text-white animate-pulse text-center text-xl" v-if="done && errors">
                Publish ended with errors. No page published.
            </div>
        </div>
        <modal 
            size="md"
            position="modal"
            v-if="create"
            @close="create=!create"
            @click_0="create=!create"
            @click_1="createProject"
            buttons="save">
            <div slot="title">New Project</div>
            <div slot="content" class="p-2 flex flex-col">
                <label>Project name</label>
                <input type="text" v-model="newProject"/>
            </div>
        </modal>
        <modal 
            v-if="selectComponent"
            size="lg"
            position="modal"
            buttons="none"
            @close="selectComponent=!selectComponent">
            <div slot="title">Block/Template</div>
            <div slot="content">
                <block-gallery-selection @component="setComponent"/>
            </div>
        </modal>
        <modal v-if="imagePreview" size="lg" position="modal" @close="imagePreview=!imagePreview" buttons="none">
            <div slot="title">Preview</div>
            <img slot="content" :src="imageZoom" class="w-full h-full object-contain" @click="imagePreview=!imagePreview"/>
        </modal>
        
    </div>
</template>

<script>
export default {
    name: 'WhoobeProjects',
    components: {
        'whoobe-used-images' : () => import ( './used.images.vue' ),
        'block-gallery-selection' : () => import ( '@/components/blocks/actions/block.gallery.selection.vue' )
    },
    data:()=>({
        tab: 'project',
        selected : null,
        create: false,
        newProject: 'new project', 
        landingPages: null,
        landing: null,
        target: null,
        selectComponent: false,
        output:'Ready to start ...\n',
        errors:'',
        commit: false,
        imagePreview: false,
        imageZoom: null,
        resources: false,
        done: ''
    }),
    computed:{
        schema(){
            return this.$mapState().datastore.schema.projects
        },
        hasStore(){
            return this.selected.hasOwnProperty('store')
        }
    },
   
    methods:{
        active(name){
            return
            return name === JSON.parse(window.localStorage.getItem ( 'whoobe-workspace' )).name ?
                'bg-blue-400 text-white' : ''
        },
        getProjectData(project){
            this.$projectUsage()
        },
        getProject(name){
            this.$loading(true)
            this.$api.service ( 'projects' ).find ( { query: { project: name } } ).then ( res => {
                this.selected = res
                this.selected.name = name
                this.selected.component.hasOwnProperty('seo') ? 
                    null : 
                        this.selected.component.seo = {
                            title: name,
                            description: ''
                        }
                this.$api.service ( 'resources' ).create ( { project : this.selected } ).then ( res => {
                    console.log ( res )
                    this.selected.purge = res
                    this.$loading(false)
                })
            })

        },
        async publish (){
            //this.$message('Collecting resources to publish ... please wait')
            this.selected = this.$projectResources ( this.selected )
            this.$message('Resources collected')
            this.output = ''
            this.errors = ''
            this.done = ''
            this.$api.service('whoobe/build').create({project:this.selected,uploads:this.selected.uploads,fonts:this.selected.fonts,commit:this.commit,store:this.hasStore?this.selected.store:false}).then ( res =>{
                    this.output += res.data
            })
        },
        preview(){
            this.$api.service('whoobe/build').find ( { query: { preview: true} } ).then ( res => {
                window.open('http://localhost:5000','whoobe')
            })
        },
        openProject(name){
            this.$api.service ( 'projects' ).find ( { query: { project: name , connect: true } } ).then ( res => {
                console.log ( res )
                this.selected = res
                this.selected.name = name
                this.selected.component.hasOwnProperty('seo') ? 
                    null : 
                        this.selected.component.seo = {
                            title: name,
                            description: ''
                        }
                window.localStorage.setItem ( 'whoobe-workspace' , name )
                location.reload()
            })
        },
        saveProject(){
            //this.selected.fonts = Array.isArray(this.selected.fonts) ? this.selected.fonts.join('|') : this.selected.fonts
            //this.selected.fonts = this.selected.fonts.replaceAll(' ','+')
            this.$api.service ( 'projects' ).patch ( this.selected._id , this.selected ).then ( res => {
                console.log ( res )
            })
            
        },
        createProject(){
            this.$api.service ( 'projects' ).create ( {
                name: this.newProject.toLowerCase()
            }).then ( result => {
                this.$message ( result )
                this.create = false
                console.log ( result )
            })
        },
        setImages(images,fonts,purgeCSS ){
            this.uploads = images
            this.fonts = fonts
            this.fonts.push ( 'Barlow Condensed' )
            this.selected.fonts = this.fonts
            this.selected.uploads = images
            this.selected.purge = purgeCSS
        },
        setComponent ( component ){
            this.$loading ( true )
            this.selectComponent = false
            this.selected.name = component.name
            this.selected.component = component
            this.selected.single = component._id
            this.selected.landing = component._id
            this.selected.component.hasOwnProperty('seo') ? 
                    null : 
                        this.selected.component.seo = {
                            title: component.name,
                            description: ''
                        }
            this.$api.service ( 'resources' ).create ( { project : this.selected } ).then ( res => {
                    console.log ( res )
                    this.selected.purge = res
                    this.selected = this.$projectResources ( this.selected )
                    this.$loading(false)
            })
            //this.selected = this.$projectResources(this.selected)
        },
        async loadResources(project){
            this.$loading(true)
            this.output = 'Collecting resources ...'
            this.resources = true
            project = await this.$projectResources ( project )
            this.resources = false
            this.output += 'Starting building process ...'
            return project
        }
    },
    mounted(){
        this.$message ( 'Loading project ...')
        if ( this.$mapState().desktop.project ){
            this.$loading(true)
            this.selected = this.$mapState().desktop.project
            this.$api.service ( 'components' ).get ( this.$mapState().desktop.project.component._id ).then ( res => {
                delete res.autosave
                this.selected.component = res
                
                this.selected.hasOwnProperty('analytics') ? null : this.selected.analytics = ''
                this.selected.component.hasOwnProperty('seo') ? 
                        null : 
                            this.selected.component.seo = {
                                title: this.selected.component.name,
                                description: ''
                            }
                this.$api.service ( 'resources' ).create ( { project : this.selected } ).then ( res => {
                    console.log ( res )
                    this.selected.purge = res
                    this.$loading(false)
                })
                this.selected = this.$projectResources ( this.selected )
                //console.log ( 'calcolo interno ... ' , this.$projectResources ( this.selected ))
            })
        }
        this.$api.service ( 'components' ).find ( {query:{category:'landing page'}} ).then ( res => {
            this.landingPages = res.data
        })

        this.$api.service('generate').on ( 'created' , (data) => {
            
            if ( data.data ){
                if ( data.data.includes('done') ){
                    this.done = 'Yahiiii project published!'
                }
                !data.data.includes('undefined') ? this.output += data.data.normalize().replace('undefined','') : null
                //term.write ( data.data + '\n')
            } 
            if ( data.error ){
                this.errors += data.error.normalize()
            }
            document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
            document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        })
    }
}
</script>