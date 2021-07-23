<template>
    <div class="p-2 grid grid-cols-2 gap-2 theme-dark text-xs" v-if="component">
        <div class="">
            <div class="bg-gray-900 px-1">SEO</div>
            <plugin-seo class=""/>
            
            <div class="bg-gray-900 px-1">Target Folder</div>
            <div class="flex flex-col p-2">
                <input type="text" class="w-full dark" placeholder="./dist" v-model="project.target"/>
            </div>
            <div class="px-2">
            <small class="text-gray-600">Folder where the generated files will be created. Has to be an absolute path</small>
            </div>
        </div>
        <div>
            <div class="bg-gray-900 px-1">Analytics <span class="text-purple-400">[Advanced]</span></div>
            <div class="flex flex-col p-2">
                <label>GA</label>
                <input type="text" class="dark w-full" placeholder="Google Analytics" v-model="project.analytics"/>
            </div>
        </div>
       
        <div class="flex flex-col pt-4">
            
            <div class="flex flex-col" v-if="!project.local">
                <div v-if="!project.local">You are publishing online!</div>
                <!-- <div class="flex">
                    <input type="checkbox" v-if="!project.local" v-model="deploy"> Deploy
                </div> -->
            </div>
            <div class="flex items-center justify-around">
                <button class="lg rounded bg-purple-600" @click="buildProject()">Generate</button>
                <button v-if="project.local && preview" class="lg rounded bg-indigo-600" @click="previewProject()">Preview</button>
                <button v-if="!project.local" class="lg rounded bg-red-600" @click="runDeploy=!runDeploy">Deploy</button>
            </div>
            <div v-if="project.local && preview">
                Since the generated pages use a service worker to enhance the user experience, in local environment you could have some cached page since last generation. <br>
                Unregister the service worker and reload the page to update the browser to the last generation.

            </div>
        </div>
        
        <div class="fixed inset-0 bg-black h-screen w-screen bg-opacity-75 z-2xtop" v-if="publish"></div>
        <modal
            v-if="publish"
            size="lg"
            position="modal"
            buttons="none"
            @close="publish=!publish">
            <div slot="title">Publish {{ project.name }}</div>
            <div slot="content" class="p-4">
                <div class="grid grid-cols-3 gap-10 h-1/2">
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
        </modal>
    </div>
</template>

<script>
export default {
    name: 'WhoobeGeneratorBuild',
    components: {
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
            if ( message && !this.project.local && message.includes('Saved') ){
                this.output = ''
                this.$message ( 'Current page has been published')
            }
        },
        '$store.state.editor.component':function(comp){
            this.loadComponent()
        }
    },
    methods:{
        buildProject(){
            let project = this.project.component
            project.local = JSON.parse(window.localStorage.getItem('whoobe-local')) || true
            this.errors = ''
            this.output = ''
            this.publish = true
            console.log ( project )
            this.$api.service('whoobe/build').create({project:project,commit:this.deploy}).then ( response =>{
                    window.localStorage.setItem ( 'whoobe-last-build' , JSON.stringify(this.project) )
                    
            }).catch ( error => {

            })
        },
        loadProject(){
            //this.$loading(true)
            this.project = this.$projectResources ( this.project )
            let vm = this
            this.$api.service ( 'resources' ).create ( { project : this.project } ).then ( res => {
                vm.project.purge = res
                vm.errors = ''
                vm.output = ''
                vm.publish = true
                delete vm.project.autosave
                vm.$api.service('whoobe/build').create({project:vm.project,store:this.hasStore?this.project.store:false,commit:vm.deploy}).then ( response =>{
                    window.localStorage.setItem ( 'whoobe-last-build' , JSON.stringify(vm.project) )
                    // vm.$api.service('components').patch(component._id,component).then ( res => {
                    //     console.log ( 'Component with project' , res )
                    // })
                })
                //this.$loading(false)
            })
            
        },
        previewProject(){
             this.$api.service('whoobe/build').find ( { query: { preview: true} } ).then ( res => {
                window.open('http://localhost:8000','whoobe')
            })
        },
        savePage(){
            //this.$loading ( true )
            let component = this.editor.component
            if ( !component.hasOwnProperty('seo') ){
                this.$message ( 'SEO data are required in order to publish the page' )
                return
            }
            this.output = 'Saving data ...'

            window.localStorage.setItem('whoobe-component',JSON.stringify(component) )
            delete component.autosave
            component.blocks_id ?
                component.blocks_id === component.json.id ?
                    null :
                        component.blocks_id = component.json.id 
                            : component.blocks_id = component.json.id
                            
            this.$saveComponent ( component ).then ( res => {
                this.$loading(false)
                this.output = component.name + ' => Saved !'
                this.loadProject()
            }).catch ( err => {
                this.$loading(false)
                this.$message('An error occured. Check you console log.')
                this.$action()
            })
        },
        deploySite(){
            if ( this.deploy_hook ){
                fetch ( this.deploy_hook , { method: 'POST'} )
                    .then ( result => result.json() )
                    .then ( deployed => { 
                        this.output = ''
                        this.$message ( 'Deployed' )
                        this.$action()
                        return
                    })
                    .catch ( error => {
                        this.$message ( 'Ooooops! Something went wrong. Check your console for errors' )
                        return
                    })
            }
        },
        loadComponent(){
            this.component = this.$mapState().editor.component
            this.project.component = this.$mapState().editor.component
            this.project.name = this.$mapState().editor.component.name
            this.project.uploads = []
            this.project.fonts = []
            this.project.purge = ''
            this.project.local = true
            if  ( !JSON.parse(window.localStorage.getItem('whoobe-local'))  ){
                this.project.local = false
            }
            this.project.analytics = ''
        }
    },
    mounted(){
        if ( this.$attrs.project ){
            this.project = this.$attrs.project
            this.component = this.$attrs.project.component
        } else {
            this.loadComponent()
        }

        this.$api.service('components').on('patched',(data) => {
            if ( data._id === this.project.component._id ){ 
                this.$store.dispatch ( 'setComponent' , data )
                this.$message ( 'Blocks updated' )
                this.loadComponent()
            }
        })
        this.$api.service('generate').on ( 'created' , (data) => {
            
            if ( data.data ){
               
                if ( !this.project.local && data.data.includes ( 'Saved' ) ){
                    this.$message ( 'Published on remote Whoobe. Ready to deploy')
                }
                if ( this.project.local && data.data.includes('done') ){
                    this.preview = true
                }
                //!data.data.includes('undefined') ? this.output += data.data.normalize().replace('undefined','') : null
                !data.data.includes('undefined') ? this.output += data.data.normalize().replace('undefined','') : null
                //term.write ( data.data + '\n')
            } 
            if ( data.error ){
                this.errors += data.error.normalize()
                
            }
            // document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
            // document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        })
    },

}
</script>