<template>
    <div v-if="user" class="p-4">


        <h3>Staging: Transfer to Production</h3>
        
        <div v-if="enabled">
            <div class="flex flex-row">
                <button class="rounded-none bg-white text-blue-300 mr-2" @click="start=0,limit=10,mode='articles'">Articles</button> 
                <button class="rounded-none bg-white text-blue-300 mr-2" @click="start=0,limit=10,mode='components'">Components</button>
                <!-- <button class="rounded-none bg-white text-blue-300 mr-2" @click="start=0,limit=16,mode='upload'">Media</button> -->
            </div>
            <div class="flex flex-row">
                <div class="w-1/2 p-2">
                    <h4 class="bg-blue-200 p-1">Staging</h4>
                    <div><i class="material-icons">dns</i> {{ staging }}</div>
                    <div v-if="mode==='articles'">
                        <div class="font-bold">Articles  <span v-if="total">[{{total}}]</span></div>
                        <!-- <draggable tag="div" :list="moka.articles" :group="{ name: 'articles', pull: 'clone', put: false }" -->
                        
                        <div class="flex flex-col"> 
                            <template v-for="(article,index) in articles">
                                <div class="text-sm p-1 flex-row flex mb-1 border shadow cursor-pointer" title="double click to transfer"   @dblclick="origin=article,confirm=!confirm">
                                    <div class="w-8">{{index+1}}</div>
                                    <div class="w-16 mr-4">{{ $moment(article.updated_at)}}</div> 
                                    <div>
                                        {{article.title}}
                                        <br/>
                                        slug: <i>{{ article.slug }}</i>

                                    </div>
                                </div>
                            </template> 
                        
                        </div>
                        <!--<select size="10" class="w-64">
                            <option v-for="article in moka.articles" :value="article"  @dblclick="origin=article,confirm=!confirm">{{ article.title }}</option>
                        </select>-->
                    </div>
                    
                    <div v-if="mode==='components'">
                        <div class="font-bold">Components</div>
                        <div class="grid grid-cols-2 gap-2">
                            <select size="10" class="w-full">
                                <option v-for="option in localcomponents" :value="option"  @dblclick="origin=option,confirm=!confirm" @click="origin=option">{{ option.name }}</option>
                            </select>
                            <div v-if="origin && origin.image_uri" class="bg-gray-800 h-64 w-full bg-contain bg-no-repeat bg-center border" :style="'background-image:url(' + origin.image_uri + ')'"></div>
                            <div v-if="origin && origin.image && origin.image.url" class="bg-gray-800 h-64 w-full bg-contain bg-no-repeat bg-center border" :style="'background-image:url(' + $imageURL(origin.image) + ')'"></div>
                        </div>
                    </div>
                    <!--
                    <div v-if="files && mode==='upload'">
                        <div class="font-bold">Media <span class="text-xs">Drag&Drop to server</span></div>
                        <draggable tag="div" :list="files" :group="{ name: 'media', pull: 'clone', put: false }" class="flex flex-row flex-wrap justify-center">
                            <template v-for="file in files">
                                <div v-model="files" class="flex items-center text-center justify-center w-24 h-24 mr-2 mb-2 cursor-move">
                                    <img :src="file.url" v-if="file.mime.split('/')[0]==='image'" class="w-24 h-24 object-cover border"/>
                                    <img :src="file.previewUrl" v-if="file.mime.split('/')[0]==='video'" class="w-24 h-24 object-cover border"/> 
                                    <div v-if="file.mime.split('/')[0]!='image' && file.mime.split('/')[0]!='video'" class="text-xs border h-24 w-24">{{ file.name }}</div>
                                </div>
                            </template>
                            
                        </draggable>
                    
                    </div>
                    -->
                    <div class="w-full flex justify-around">
                                <i @click="prev" v-if="start > 0" class="material-icons mr-2 text-3xl cursor-pointer">chevron_left</i>
                                <i v-if="start < 1" class="material-icons mr-2 text-3xl text-gray-300">chevron_left</i>
                                <i @click="next" v-if="(limit+start)<total" class="material-icons text-3xl cursor-pointer">chevron_right</i>
                                <i v-else="(limit+start)<total" class="material-icons text-3xl cursor-pointer text-gray-300">chevron_right</i>
                                
                            </div>
                </div>
                <div class="w-1/2 p-2">
                    <h4 class="bg-purple-500 p-1">Production</h4>
                    <draggable :list="trash" group="removed"><i class="material-icons">dns</i> {{ master }}</draggable>
                    <div class="bg-lime-300 text-sm p-1" v-if="!articlesRemote && mode==='articles'">Loading ...</div>
                    <div v-if="production && mode==='articles'">
                        <div class="font-bold">Articles</div>
                        <template v-for="(article,index) in articlesRemote">
                                <div class="text-sm p-1 flex-row flex mb-1 border shadow cursor-pointer" title="double click to transfer"   @dblclick="origin=article,confirm=!confirm">
                                    <div class="w-8">{{index+1}}</div>
                                    <div class="w-16 mr-4">{{ $moment(article.updated_at)}}</div> 
                                    <div>
                                        {{article.title}}
                                        <br/>
                                        slug: <i>{{ article.slug }}</i>

                                    </div>
                                </div>
                            </template> 
                        <!--<select multiple size="10" class="w-64">
                            <option v-for="article in articles" :value="article">{{ article.title }}</option>
                        </select>-->
                    </div>
                    <div class="bg-lime-300 text-sm p-1" v-if="!blocks && mode==='components'">Loading ...</div>
                    <div v-if="components && mode==='components'">
                        <div class="font-bold">Components</div>
                        <div class="grid grid-cols-2">
                            <select size="10" class="w-64">
                                <option v-for="option in blocks" :value="option">{{ option.name }}</option>
                            </select>
                            
                        </div>
                    </div>
                    <div v-if="files && mode==='upload'">
                        <div class="font-bold">Media <span class="text-xs">Dblclick to remove image</span></div>
                        <draggable :list="serverMedia" group="media"  style="min-height:5rem" class="flex flex-row flex-wrap bg-gray-300 p-2">
                        
                            <template v-for="(file,index) in serverMedia">
                                <div v-model="files" class="flex items-center text-center justify-center w-24 h-24 mr-2 mb-2" @dblclick="serverMedia.splice(index,1)">
                                    <img :src="file.url" v-if="file.mime.split('/')[0]==='image'" class="w-24 h-24 object-cover border"/>
                                    <img :src="file.previewUrl" v-if="file.mime.split('/')[0]==='video'" class="w-24 h-24 object-cover border"/> 
                                    <div v-if="file.mime.split('/')[0]!='image' && file.mime.split('/')[0]!='video'" class="text-xs border h-24 w-24">{{ file.name }}</div>
                                </div>
                            </template>
                        
                        </draggable>
                        <button @click="transferMedia" v-if="serverMedia.length">Transfer</button>
                    </div>
                </div>
            </div>
            <div v-if="confirm" class="nuxpresso-modal w-1/3 bg-white z-2xtop p-2 flex flex-col shadow">
                <h4>Confirm transfer</h4>
                {{ origin.name || origin.title }}
                <div class="my-2">
                    <button class="float-left mr-2 danger" @click="confirm=!confirm">Close</button>
                    <button class="success" @click="transfer(mode,origin)">Yes</button>
                </div>
                <div v-if="message">{{ message }} <button class="warning" @click="updateArticle=true">YES</button></div>
            </div>
        </div>
        <div v-else>
            
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import draggable from 'vuedraggable'
export default {
    name: 'MokaStaging',
    components: { draggable },
    data:()=>({
        articlesRemote: null,
        total: 0,
        blocks: null,
        origin:null,
        mode: 'articles',
        confirm: false,
        start: 0,
        limit:10,
        serverArticles:[],
        serverMedia:[],
        trash:[],
        message: '',
        updateArticle: false
    }),
    computed:{
        ...mapState ( ['moka','user']),
        enabled(){
            if ( typeof webpackHotUpdate === 'undefined' ) this.$store.dispatch('message','This option is available only in development mode')
            return typeof webpackHotUpdate === 'undefined' ? false : true 
        },
        dragOptions() {
            return {
                animation: 0,
                group: "description",
                disabled: !this.editable,
                ghostClass: "ghost"
            }
        },
        master(){
            return this.moka.remote_api
        },
        staging(){
            return process.env.VUE_APP_API_URL
        },
        production(){
            console.log ( 'loading' )
            return this.remote.get ( this.master + 'articles' ).then ( response => {
                this.articlesRemote = response.data//this.moka.articles
                this.$store.dispatch('loading',false)
                console.log ( 'loaded articles')
                return true// response.data
            })
        },
        components(){
            return this.remote.get ( this.master + 'components' ).then ( response => {
                this.blocks = response.data
                return true //response.data
            })
        },
        remote(){
            return axios
        }
    },
    watch:{
        updateArticle(v){
            if ( v ){
                this.update ( this.mode  , this.origin )
                this.message = ''
                this.updateArticle = false
            }
        },
        
    },
    methods: {
        next(){
            this.start = this.start + this.limit
        },
        prev(){
            this.start = this.start - this.limit
        },
        onEndArticle(event){
            this.origin = this.serverArticles[this.serverArticles.length-1] 
            this.confirm = true
            
        },
        transferMedia (){
            this.serverMedia.forEach ( media => {
                media['Upload']  = { status: true }
                this.remote.post ( this.master + 'upload' , media ,{
                headers:{
                    'Authorization': window.localStorage.getItem('nuxpresso-production-jwt')
                }
                }).then ( response => {
                    console.log ( response )
                }).catch ( error => {
                    console.log ( error )
                })
            })
        },
        save(target,origin){
            this.confirm = false
            origin.updated_at = this.$moment( new Date , 'YYYY-MM-DD HH:mm:ss')
            this.remote.post ( this.master + target , origin ,{
                headers:{
                    'Authorization': window.localStorage.getItem('nuxpresso-production-jwt')
                }
            }).then ( response => {
                    this.$store.dispatch('message','Data transferred correctly')
                    console.log ( response )
                    
                    this.mode === 'components' ? 
                        this.blocks.push ( response.data ) :
                            this.articlesRemote.push ( response.data )
            }).catch ( error => {
                console.log ( error )
            })
        },
        update(target,origin){
            this.remote.put ( this.master + target + '/' + origin.id , origin ,{
                headers:{
                    'Authorization': window.localStorage.getItem('nuxpresso-production-jwt')
                }
            }).then ( response => {
                    this.$store.dispatch('message','Data transferred correctly')
                    this.confirm = false
                    
            }).catch ( error => {
                console.log ( error )
            })
        },
        transfer(scope,origin){
            if ( this.mode === 'components' ){
                this.$http.get('components/' + origin.id ).then ( response => {
                    let block = response.data 
                    this.save ( this.mode , block )
                })
            } else {
                this.$http.get('articles/' + origin.id ).then ( response=>{
                    let article = response.data
                    let art = this.articlesRemote.filter ( a => a.slug === article.slug )[0]
                    if ( art ){
                        
                        this.origin = article
                        this.origin.id = art.id 
                        this.origin.seo_title = article.title
                        this.origin.seo_description = article.seo_description
                        if ( this.origin.image ){
                            this.origin.featured_img = this.origin.image
                            this.origin.image = null
                        }
                        this.message = 'An article is present in production with the same slug. Do you want to update the remote article?'
                    } else {
                        this.save ( this.mode , article )
                    }
                    
                    //this.save ( this.mode , origin )
                })
            } 
            
        }
    },
    mounted(){
        this.$http.get('articles/count').then ( response => {
            this.total = parseInt(response.data )
            console.log ( 'total=>' , response )
        })
        if ( this.enabled ){
            this.remote.post ( this.master + 'auth/local' , {
                identifier: this.moka.remote_user,
                password: this.moka.remote_password
            } ).then(response => {
            // Handle success.
            console.log ( response )
            let authenticated = {
                user : response.data.user,
                jwt : response.data.jwt
            }
            window.localStorage.setItem ( 'nuxpresso-production-jwt' , "Bearer " + response.data.jwt )
            this.remote.headers = {
                'Authorization': window.localStorage.getItem('nuxpresso-production-jwt')
                }
            })
            .catch(error => {
            console.log ( error )
            
            });
        }
    },

}
</script>