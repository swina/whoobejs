<template>
    <div class="p-2 theme-dark rounded text-xs" v-if="component">
        <div class="border mt-2 border-gray-700 rounded-lg">
            <div class="rounded-tr-lg rounded-tl-lg bg-gray-900 px-1">Page Settings</div>
            <div class="flex flex-col p-2 bg-gray-600">
                <label>Name</label>
                <input class="dark w-full" type="text" v-model="component.name"/> 
                <label>Description</label>
                <textarea class="dark w-full" v-model="component.description"></textarea>

                <label class="">Category</label>
                <select class="dark w-full" v-model="component.category">
                    <option :key="category.label" v-for="category in $mapState().datastore.components_categories" :value="category.filter">{{ category.label }}</option>
                </select>
                
                <label class="">Type <i class="material-icons" @click="addType=!addType">add</i></label>
                <input class="dark w-full" v-if="addType" v-model="newType" @change="saveNewType"/>
                
                <select class="dark w-full" v-model="component.tags">
                    <option value=""></option>
                    <option :key="tipo" v-for="tipo in datastore.dataset.setup[0].types.components" :value="tipo">{{ tipo }}</option>
                </select>

                <label class="">Font</label>
                <select class="dark w-full" v-model="editor.component.json.fontFamily">
                    <option value="">default</option>
                    <option value="Arial">sans</option>
                    <option value="serif">serif</option>
                    <option v-for="font in editor.fonts" :value="font.replace('+',' ')">{{font.replace('+',' ')}}</option>
                    
                </select>
                <button class="mt-6 lg rounded" @click="createArticle()">Create Article</button>
            </div>
        </div>
        
        <div class="w-full bg-gray-600 cursor-pointer my-1 p-1 font-bold" @click="templateSettings=!templateSettings" v-if="component.category === 'loop'">Articles template settings <i class="material-icons">expand_more</i></div>
        <div class="flex flex-col text-sm p-1" v-if="templateSettings">

            <label class="font-bold">Default template</label>
            <div class="text-xs text-gray-600"><input type="checkbox" v-model="component.default"/> (apply to articles with no template)</div>
        
            <div class="my-1">
                <input type="checkbox" v-model="component.loop"/>
                <span class="font-bold">Loop </span>
            </div>
            <div class="flex flex-col" v-if="component.loop">
                <!-- <select class="w-full" v-model="component.loop_type">
                    <option value="">all</option>
                    <option value="articles">articles</option>
                    <option :key="opt.slug" v-for="opt in $mapState().datastore.dataset.setup[0].categories.articles" :value="opt.slug">articles/category/{{opt.name}}</option>
                </select> -->
                <div class="my-1">
                    <input type="checkbox" v-model="component.loop_pagination"/>
                    <label class="font-bold">Pagination</label> 
                </div>
                <div>Articles per page</div>
                <input class="w-full" type="number" min="1" max="100" v-model="component.loop_limit"/>
            </div>
        </div>


        <!-- <div class="border mt-2 border-gray-700 rounded-lg">
            <div class="rounded-tr-lg rounded-tl-lg bg-gray-900 px-1">SEO</div>
            <plugin-seo class="bg-gray-600"/>
        </div>
        
        
        <div class="border mt-2 border-gray-700 rounded-lg">
            <div class="rounded-tr-lg rounded-tl-lg bg-gray-900 px-1">Analytics <span class="text-purple-400">[Advanced]</span></div>
            <div class="flex flex-col p-2 bg-gray-600">
                <input type="text" class="dark w-full" placeholder="Google Analytics" v-model="project.analytics"/>
            </div>
        </div>
        
        <div class="flex flex-col pt-4">
            
            <div class="flex flex-col" v-if="!project.local">
                <div v-if="!project.local">You are publishing online!</div>
                
            </div>
            <div class="flex items-center justify-around">
                <button class="lg rounded bg-purple-600" @click="savePage()">Publish</button>
                <button v-if="preview" class="lg rounded bg-indigo-600" @click="previewProject()">Preview</button>
                <button v-if="!project.local" class="lg rounded bg-red-600" @click="runDeploy=!runDeploy">Deploy</button>
            </div>
        </div> -->
        <!--<div class="grid grid-cols-2 gap-2 p-1">
            <label class="font-bold">Mobile breakpoint </label>
            <div class="flex flex-row cursor-pointer items-center" title="Set mobile responsive breakpoint">
                <i :class="'material-icons moka-icons text-sm p-1 mr-2 ' + mobile('md')" @click="breakpoint='md'">phone_iphone</i>
                <i :class="'material-icons moka-icons text-sm p-1 mr-2 ' + mobile('lg')" @click="breakpoint='lg'">tablet</i>
                <i :class="'material-icons moka-icons text-sm p-1 mr-2 ' + mobile('xl')" @click="breakpoint='xl'">laptop_mac</i>
            </div>
            
        </div>
        -->
        <!-- <div class="z-highest fixed top-0 right-0  h-screen w-screen bottom-0 left-0 bg-black bg-opacity-50" v-if="output">
            <div class="absolute bottom-0 left-0 w-full p-2 pl-10 bg-black text-lime-500 font-mono">
                <i class="iconify text-gray-300" data-icon="grommet-icons:console"></i> <span class="text-gray-300">whoobe-generator $ </span> {{ output }}
           </div>
        </div> -->

        <!-- <modal
            v-if="publish"
            size="lg"
            position="modal"
            buttons="none"
            @close="publish=!publish">
            <div slot="title">Publish {{ project.name }}</div>
            <div slot="content" class="p-4">
                <div class="grid grid-cols-3 gap-10 h-1/2" v-if="output">
                    <textarea id="generated" v-model="output" style="font-family:monospace" class="text-sm w-full h-full bg-black text-green-500 font-light col-span-2">
                    </textarea>
                    <textarea id="generated_errors" v-model="errors" style="font-family:monospace" class="text-base w-full h-full bg-black text-red-400"></textarea>
                </div>
            </div>
        </modal>
        <modal 
            v-if="runDeploy"
            size="md"
            position="modal"
            @close="runDeploy=!runDeploy"
            buttons="none">
            <div slot="title">Deploy</div>
            <div slot="content" class="p-2 flex flex-col">
                
                <label>Webhook</label>
                <input type="text" v-model="deploy_hook" placeholder="deploy webhook URL" class="dark w-full">
                <blockquote class="bg-purple-600">
                    Deploy is executed only thru webhooks. If your whoobe hosting provider doesn't support deployments thru webhooks you need to run the deployment manually.<br>
                    <span class="font-bold">With deploy you will update the online version with the current page.</span>
                </blockquote>
                <button class="m-auto lg bg-red-600" @click="deploySite()">Confirm</button>
            </div>
        </modal> -->
    </div>
</template>

<script>
export default {
    name: 'WhoobeComponentSettings',
    components: {
        'block-color'   : () => import ( '../editor/tailwind/controls/tailwind.color.vue' ),
        'block-bgcolor' : () => import ( '../editor/tailwind/controls/tailwind.bgcolor.vue' ),
        'plugin-seo'    : () => import ( '@/components/plugins/seo/index.settings.vue')
    },
    data:()=>({
        bodySettings: false,
        templateSettings: false,
        addType: false,
        disableBodyCss: false,
        fontFamily:'',
        component: null,
        project:{},
        publish: false,
        runDeploy: false,
        deploy: false,
        deploy_hook: '',
        output:'',
        errors:'',
        preview: false,
        hasStore: false
    }),
    computed:{
        editor(){
            return this.$mapState().editor
        },
        // component(){
        //     return this.$mapState().editor.component
        // },
        datastore(){
            return this.$mapState().datastore
        }
    },
    watch:{
        output(message){
            console.log ( message.includes('Saved') )
            if ( message && !this.project.local && message.includes('Saved') ){
                this.output = ''
                this.$message ( 'Current page has been published')
            }
        },
        // '$store.state.editor.component':function(comp){
        //     this.loadComponent()
        // }
    },
    methods:{
        createArticle(){
            let article = {}
            article.title = this.component.name
            article.slug = this.$slugify(this.component.name)
            article.publish = true
            article.component = this.component._id
            article.content = ''
            article.excerpt = ''
            article.seo_title = this.component.seo.title
            article.seo_description = this.component.seo.description
            article.template_id = this.component._id
            article.template_preview = this.component.image
            article.categories = 'page'
            let blocks = this.component
            delete blocks.autosave
            article.blocks = blocks
            this.$api.service ( 'articles' ).create ( article ).then ( res => {
                this.$message ( 'Article created!' )
                this.$mapState().datastore.dataset.articles.push ( res )
            }).catch ( error => {
                this.$message ( 'An error occurred. Check you console log')
            })
        }
        // loadProject(){
        //     //this.$loading(true)
        //     this.project = this.$projectResources ( this.project )
        //     let vm = this
        //     this.$api.service ( 'resources' ).create ( { project : this.project } ).then ( res => {
        //         vm.project.purge = res
        //         // let component = vm.editor.component
        //         // component.project = vm.project
        //         vm.publish = true
        //         vm.$api.service('whoobe/build').create({project:vm.project,store:this.hasStore?this.project.store:false,commit:vm.deploy}).then ( response =>{
                    
        //             console.log ( response )
        //             // vm.$api.service('components').patch(component._id,component).then ( res => {
        //             //     console.log ( 'Component with project' , res )
        //             // })
        //         })
        //         //this.$loading(false)
        //     })
            
        // },
        // previewProject(){
        //      this.$api.service('whoobe/build').find ( { query: { preview: true} } ).then ( res => {
        //         window.open('http://localhost:5000','whoobe')
        //     })
        // },
        // savePage(){
        //     //this.$loading ( true )
        //     let component = this.editor.component
        //     if ( !component.hasOwnProperty('seo') ){
        //         this.$message ( 'SEO data are required in order to publish the page' )
        //         return
        //     }
        //     this.output = 'Saving data ...'

        //     window.localStorage.setItem('whoobe-component',JSON.stringify(component) )
        //     delete component.autosave
        //     component.blocks_id ?
        //         component.blocks_id === component.json.id ?
        //             null :
        //                 component.blocks_id = component.json.id 
        //                     : component.blocks_id = component.json.id
                            
        //     this.$saveComponent ( component ).then ( res => {
        //         this.$loading(false)
        //         this.output = component.name + ' => Saved !'
        //         this.loadProject()
        //         console.log ( res )
        //     }).catch ( err => {
        //         this.$loading(false)
        //         this.$message('An error occured. Check you console log.')
        //         this.$action()
        //         console.log ( err )
        //     })
        // },
        // deploySite(){
        //     if ( this.deploy_hook ){
        //         fetch ( this.deploy_hook , { method: 'POST'} )
        //             .then ( result => result.json() )
        //             .then ( deployed => { 
        //                 this.output = ''
        //                 console.log ( deployed )
        //                 this.$message ( 'Deployed' )
        //                 this.$action()
        //                 return
        //             })
        //             .catch ( error => {
        //                 this.$message ( 'Ooooops! Something went wrong. Check your console for errors' )
        //                 return
        //             })
        //     }
        // },
        // loadComponent(){
        //     this.component = this.$mapState().editor.component
        //     this.project.component = this.$mapState().editor.component
        //     this.project.name = this.$mapState().editor.component.name
        //     this.project.uploads = []
        //     this.project.fonts = []
        //     this.project.purge = ''
        //     this.project.local = true
        //     if  ( !JSON.parse(window.localStorage.getItem('whoobe-local'))  ){
        //         this.project.local = false
        //     }
        //     this.project.analytics = ''
        // }
    },
    mounted(){
        this.component = this.$mapState().editor.component
        //this.loadComponent()
        // this.$api.service('components').on('patched',(data) => {
        //     if ( data._id === this.project.component._id ){ 
        //         this.$store.dispatch ( 'setComponent' , data )
        //         this.$message ( 'Blocks updated' )
        //         this.loadComponent()
        //     }
        // })
        // this.$api.service('generate').on ( 'created' , (data) => {
            
        //     if ( data.data ){
        //         // if ( this.project.local && data.data.includes('Whoobe Site Generation done!') ){
        //         // // //     //this.output = ''
        //         //       this.$message ( 'Yahiiii project published!' )
        //         // //      this.preview = true
        //         // //      return
        //         // } 
        //         if ( !this.project.local && data.data.includes ( 'Saved' ) ){
        //         //     this.output = ''
        //             this.$message ( 'Published on remote Whoobe. Ready to deploy')
        //         //     return
        //         }
        //         //!data.data.includes('undefined') ? this.output += data.data.normalize().replace('undefined','') : null
        //         !data.data.includes('undefined') ? this.output += data.data.normalize().replace('undefined','') : null
        //         //term.write ( data.data + '\n')
        //     } 
        //     if ( data.error ){
        //         this.errors += data.error.normalize()
        //         // this.output = 'ERROR! ' + data.error.normalize() 
        //     }
        //     document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
        //     document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        // })
    },

}
</script>