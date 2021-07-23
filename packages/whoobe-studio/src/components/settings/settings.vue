<template>
    <div class="p-4">
        <div class="flex flex-row text-sm cursor-pointer">
            <template v-for="t in tabs">
                <div @click="tab=t.tag" :class="tab===t.tag?'bg-black':''" class="px-2 desktop-tab capitalize border-0">{{t.label}}</div>    
            </template>
        </div>
        <div class="flex flex-col justify-around">
            <!-- <div v-if="tab==='projects'">
                <h5 class="bg-gray-700 text-gray-200 p-1">Projects</h5>
                <div class="flex flex-row p-2 w-full text-base">
                    <whoobe-projects/>
                </div>
            </div> -->
            <!-- <div v-if="tab==='website'" class="border border-t-0 relative pb-8">
                <h5 class="bg-gray-700 text-gray-200 p-1">Site generator settings</h5>
                <div class="flex flex-row p-2 w-full text-base">
                        
                    <div class="w-1/2 flex flex-col">
                        <label class="font-bold">SEO Title (default)</label>
                        <input type="text" v-model="$datastore('setup').general.seo_title"/>
                        <label class="font-bold">SEO Description (default)</label>
                        <textarea v-model="$datastore('setup').general.seo_description" class="w-3/4"/>
                        
                        
                        <label class="font-bold">Read More text</label>
                        <input type="text" v-model="$datastore('setup').general.read_more"/>

                        <label class="font-bold">Responsive menu class</label>
                        <textarea v-model="$datastore('setup').general.responsive_menu_css" class="w-3/4"/>

                        <label class="font-bold">Responsive menu transition</label>
                        <input type="text" v-model="$datastore('setup').general.responsive_menu_transition"/>
                        <p class="text-xs">(default fade)</p>
                    </div>
                    
                </div>
                <button class="absolute bottom-0 right-0 m-2" @click="saveSettings">Save</button>
            </div>
            <div v-if="tab==='categories'" class="border border-t-0">
                <moka-categories></moka-categories>
            </div> -->
            
            <div v-if="tab==='server'" class="border border-gray-900">
                    <!-- <h5 class="theme-dark p-1">General</h5> -->
                        <div class="flex flex-col p-2">
                            <label>Server URL</label>
                            <input type="text" class="dark w-full" v-model="whoobeCMS"/>
                            
                            <div class="flex flex-row">
                                <div class="flex my-4">
                                    <input type="checkbox" v-model="whoobeLocal"/> 
                                    <label>Local Development</label>
                                </div>
                                <div class="flex my-4">
                                    <input type="checkbox" v-model="whoobeTest"/> 
                                    <label>Cloud Test</label>
                                </div>
                            </div>
                            <button @click="setWhoobeCMS()">Save</button>
                            <div v-if="serverError" class="mt-1">{{serverError}}</div>
                            <!-- <div v-if="$datastore('setup')">
                            
                            <label class="font-bold">Fonts</label>
                            <select v-if="moka" v-model="currentFont" multiple class="h-32 w-full" readonly>
                                
                                <option v-for="(font,index) in editor.fonts" :value="index">{{font}}</option>
                            </select> -->
                            <!-- <div class="text-xs">
                                To add fonts you need to update the environment variable VUE_APP_FONT_FAMILIES listing the fonts by name separated by the | character.
                                
                            </div> -->
                        </div> 
                    
                </div>
                
            </div>
            <div v-if="tab==='categories'" class="border border-gray-900">
                <whoobe-categories/>
            </div>
            <!-- <div v-if="tab==='elements'" class="border border-t-0">
                <h5 class="bg-gray-700 text-gray-200 p-1">Blocks Elements</h5>
                <moka-settings-elements/>
            </div>
            <div v-if="tab==='objects'" class="border border-t-0">
                <block-object/>
            </div> -->
        </div>
        <!-- <moka-modal
            v-if="licenseUser.login"
            @close="licenseUser.login=false"
            @click_0="licenseUser.login =false"
            @click_1="licenseLogin">
            <div slot="title">Authentication</div>
            <div slot="content" class="p-2 flex flex-col">
                In order to set your license key you need to login to your whoobe account.
                <label>Email</label>
                <input type="email" v-model="licenseUser.email"/>
                <label>Password</label>
                <input type="password" v-model="licenseUser.password"/>
            </div>
            <div slot="footer">
                <div>{{ licenseUser.message }}</div>
            </div>
        </moka-modal> -->
    </div>
</template>

<script>
// import MokaUser from '@/components/settings/user'
// import MokaColor from '@/components/editor/tailwind/tailwind.color'
// import MokaBgcolor from '@/components/editor/tailwind/tailwind.bgcolor'
import MokaSettingsElements from './elements'
import WhoobeProjects from './projects'
import MokaCategories from './categories'
import { mapState } from 'vuex'
import classes from '@/scripts/tw.classes'
import axios from 'axios'
export default {
    name: 'WhoobeSettings',
    components: { 
        MokaSettingsElements , MokaCategories , WhoobeProjects ,
        'block-object' : () => import ( './block.object.vue' ),
        'whoobe-website' : () => import ( './website.vue'),
        'whoobe-categories' : () => import ( './categories.vue' ) 
    },
    data:()=>({
        tabs: [
            // { label: 'Workspace' , tag: 'projects' },
            { label: 'Server' , tag: 'server' },
            // { label: 'Generator' , tag: 'website' },
            { label: 'Categories' , tag: 'categories'},
            //{ label: 'Blocks Elements' , tag: 'elements'},
            //{ label: 'Blocks Object' , tag: 'objects'}
        ],
        tab: 'server',
        types: null,
        new_type:'',
        currentColor: '',
        currentType: [],
        currentFont: [],
        new_font:'',
        newUser: {
            username: '',
            email: '',
            pasword: '',
            confirm: ''
        },
        whoobeCMS: '',
        whoobeLocal: true,
        whoobeTest: false,
        serverError: '',
        license: '',
        licenseMessage: '',
        licenseUser: {
            login: false,
            email:'',
            password:'',
            message: ''
        },
        testServer: 'https://whoobe-server-alpha.herokuapp.com/'
    }),
    computed: {
        ...mapState ( ['moka','user','datastore','editor'] ),
        whoobeStatus(){
            return window.localStorage.getItem ( 'whoobe-cms' )
        },     
        colors(){
            return this.mokacolors()
        },
        
    },
    watch: {
        whoobeLocal(v){
            v ? this.whoobeCMS = 'http://localhost:3030/' : this.whoobeCMS = ''
            v ? this.whoobeTest = false : this.whoobeTest ? this.whoobeCMS = this.testServer : null
        },
        whoobeCMS(){
            this.serverError = ''
        },
        whoobeTest(v){
            v ? this.whoobeLocal = false : null
            v ? this.whoobeCMS = this.testServer : ''
        },
        
    },
    mounted(){
        
        if ( window.localStorage.getItem('whoobe-cms') ){
            this.whoobeCMS = window.localStorage.getItem('whoobe-cms')
            this.whoobeLocal = JSON.parse(window.localStorage.getItem('whoobe-local'))
        }
       
        // this.$apiwhoobe.authenticate().then ( res => {
        //     console.log ( 'user authenticated')
        //     if ( window.localStorage.getItem('whoobe') ){
        //         let license = JSON.parse(window.localStorage.getItem('whoobe'))
        //         console.log ( license )
        //         this.license = license.apikey
        //     } else {
        //         this.licenseUser.login = true
        //     }
        // }).catch ( error => {
        //     console.log ( error )
        //     this.licenseUser.login = true
        // })
    },
    methods:{
        
        setWhoobeCMS(){
            
            if ( this.whoobeCMS.slice(-1) != '/' ){
                this.whoobeCMS = this.whoobeCMS + '/'
                
            }
            this.serverError = 'Checking connection ... please wait!'
            fetch ( this.whoobeCMS ).then ( res => {
                this.serverError = ''
                this.$action()
                window.localStorage.setItem ( 'whoobe-cms' , this.whoobeCMS )
                window.localStorage.setItem ( 'whoobe-local' , this.whoobeLocal )
                window.localStorage.removeItem ( 'feathers-jwt' )
                this.$store.dispatch('login',false)
                alert ( 'Changed Whoobe Server')
                window.location.reload()
                this.$router.push ( '/' )
            }).catch ( error => {
                this.serverError = 'Server URL is not valid or no server responding to the URL submitted'
                this.$message('Server URL is not valid or no server responding to the URL submitted')
                console.log ( error )
            })
        
        },
        setLicense(){
            
            // this.$apiwhoobe.service('apikeys').find ( { query : { apikey: this.license , active: 1}}).then ( res =>{
            //     if ( res.total ){
            //         this.$message('License Key is valid!Enjoy your new options using whoobe')
            //         window.localStorage.setItem('whoobe' , JSON.stringify ( { apikey:this.license }))
            //         this.licenseMessage = 'License is valid!!!' 
            //     } else {
            //         this.$message('Invalid license key! Some options are disabled')
            //         window.localStorage.removeItem('whoobe')
            //         this.licenseMessage = 'Invalid license key! Some options are disabled' 
            //     }
            // }).catch ( err => {
            //     this.$message ( 'Invalid license key')
            // })
        },
        licenseLogin(){
            // this.$apiwhoobe.authenticate({
            //     email: this.licenseUser.email,
            //     password: this.licenseUser.password,
            //     strategy: "local"
            // }).then ( user => {
            //     this.licenseUser.message = 'Now you can set your license key'
            //     this.$message ( this.licenseUser.message )
            //     this.licenseUser.login = false
            // }).catch ( error =>{
            //     this.licenseUser.message = 'Login error. Please check your credentials'
            //     this.$message ( 'Login error. Please check your credentials' )
            //     console.log ( error )
            // })
        },
        mokacolors(){
            return classes.colors
        },
        removeTypes(){
            this.currentType.forEach ( index => {
                this.moka.elements.types.types.splice ( index ,1 )
            })
        },
        saveTypes(){
            /*
            this.datastore.dataset.elements.types.types.sort()
            this.$api.service ( 'elements' ).patch ( this.datastore.dataset.elements[0]._id )
            this.$http.put ( 'elements' , this.moka.elements ).then ( response=>{
                this.$store.dispatch('message','Settings saved')
            }).catch ( error => {
                console.log ( error )
            })
            */
            
        },
        saveSettings(){

            /*
            this.$http.put ( 'settings' , this.moka.settings ).then ( response => {
                this.$store.dispatch('message','Settings saved')
            })
            */
        }
    },
}
</script>