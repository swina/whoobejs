<template>
    <div class="relative overflow-hidden h-screen w-screen">
        <desktop-tabs @menu="sidebar=!sidebar"/>
        <desktop-sidebar v-if="sidebar"/>
        <desktop-container :boxed="sidebar"/>
        <desktop-sidebar-right/>
        <div v-if="!$mapState().desktop.tabs.length" class="pl-10 pt-10">
            <whoobe-info/>
        </div>
        <!--<whoobe-info/>-->
        <!--<desktop-home v-if="$mapState().desktop.tabs.length === 0"/>-->
        <whoobe-intro/>
        <modal-confirm v-if="$mapState().desktop.confirm" @noconfirm="$store.dispatch('confirm',false)" @confirm="$mapState().desktop.confirmAction"/>
        <icon name="lock" class="fixed z-highest bottom-0 left-0 m-2 text-indigo-500" @click="logout()"/>
    </div>
</template>

<script>
import jp from 'jsonpath'
import { mapState } from 'vuex'
import Blocks from '@/components/blocks/blocks.vue'
export default {
    name: 'Desktop',
    data:()=>({
        sidebar: true
    }),
    computed:{
        ...mapState ( ['desktop','user'] ),
        
    },
    components: {
        Blocks,
        'desktop-sidebar'   : () => import ( './desktop.sidebar.vue'),
        'desktop-tabs'      : () => import ( './desktop.tabs.vue'),
        'desktop-sidebar-right' : () => import ( './desktop.sidebar.right.vue' ),
        'desktop-container' : () => import ( './desktop.container.vue'),
        'desktop-home'      : () => import ( './desktop.home.vue'),
        'whoobe-info'       : () => import ( '@/components/settings/info.vue' ),
        'desktop-wizard'    : () => import ( './desktop.wizard.vue' )
    },
    methods:{
        datastore(){
            this.$api.service ( 'projects' ).find().then ( res => {
                this.$store.dispatch ( 'dataset' , { table: 'projects' , data: res.data } )
                if ( res.data.length === 1 ){
                    this.$store.dispatch ( 'project' , res.data[0] )
                }
            })
            this.$loading(true)
            this.$find('plugins') 
            this.$find('settings')
            this.$find('setup')
            this.$find('elements')
            //this.$find('categories')
            this.$api.service ( 'categories' ).find ( { query: { $limit: 200 , $sort : { name : 1 } } })
                .then ( res => {
                    this.$store.dispatch ( 'dataset' , { table : 'categories' , data: res.data })
            })
            //this.$find('workspace')
            this.$api.service('block-elements').find ( { query : { $limit: 200 } } ).then ( res => {
                this.$store.dispatch ( 'dataset' , { table: 'blocks' , data: res.data } )
                let categories = jp.query ( res.data , '$..category' )
                console.log ( this.$arrayGroup ( res.data , 'category') )
                console.log ( [ ...new Set(categories) ].sort() )
            })
            this.$api.service('articles').find ( 
                { 
                    query : 
                        {
                            $limit: 200,
                            $select : ['_id', 'publish' , 'title' , 'slug' , 'categories' , 'template_id' , 'homepage' , 'active' , 'template_preview'] 
                        }
                }
            ).then ( result => {
                // result.data.forEach ( article => {
                //     if ( !article.hasOwnProperty('homepage') ){
                //         article.homepage = false
                //     }
                //     if ( !article.hasOwnProperty('store') ){
                //         article.store = false
                //     }
                //     this.$api.service ( 'articles' ).patch ( article._id , article )
                // })
                this.$loading()
                this.$store.dispatch ( 'dataset' , { table: 'articles' , data: result.data })
            })
            
        },
        logout(){
            window.localStorage.removeItem ( 'feathers-jwt' )
            this.$store.dispatch ( 'login' , false )
            this.$router.push('/login')
        },
    } ,
    mounted(){
        this.$api.authenticate().then ( res => {
            this.datastore()
            //this.$mapState().desktop.tabs.length ? null : this.homeStart()
        }).catch ( error => {
            this.$router.push('')
        })
        
            
    }
}
</script>