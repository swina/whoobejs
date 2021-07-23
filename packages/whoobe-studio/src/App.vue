<template>
  <div id="app" islogged>
    
    <router-view/>
    
    <!-- loading fullscreen -->
    <loading v-if="$mapState().desktop.loading"/>
    <!-- loading icon bottom left -->
    <icon name="bubble_chart" css="animate-spin fixed bottom-0 left-0 m-2 z-highest text-gray-100" v-if="$mapState().desktop.loading"/>
    <!-- actions component: opens modal with relative action -->
    <actions/>
    <main v-if="!logged"/>
    <!-- Global message display -->
    <transition name="fade">
        <div style="transform: translateX(-50%);left:50%;" class="border-l-4 border-blue-500 fixed bottom-0 m-auto shadow-xl mb-12 bg-gray-800 text-gray-200 text-base p-4 w-1/2  z-modal" v-if="message" >   
        {{ message }}
        </div>
    </transition>
    <!-- <transition name="fade">
      <div v-if="!user.login && !logged">
        <div class="z-modal fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-75">
        </div>
          <whoobe-login class="z-modal"/>
      </div>
    </transition> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
//import Modal from '../../whoobe-generator-alpha/components/modal.vue'
//import VuexPersistence from 'vuex-persist'
//const vuexLocal = new VuexPersistence({
//  storage: window.localStorage
//})

export default {
  name: 'App',
  components: {
    'whoobe-login'    : () => import ( '@/views/Login.vue' ),
    'actions'         : () => import ( '@/components/common/actions' ),
    'whoobe-intro'    : () => import ( '@/components/desktop/desktop.intro.vue' )
  },
 
  data:()=>({ 
    message: '',
    firstRun: false,
    logged: false
  }),
  computed:{
    ...mapState ( ['user'] ),
    islogged(){
      return this.$api.authenticate().then ( res => {
        this.$store.dispatch('login',true)
        console.log ( 'Authenticated !')
        return true
        }).catch ( error => {
          this.$router.push ( '/login' )
          return false
      })
    }
  },
  watch: {
    //when a new message diplay 
    '$store.state.desktop.message':function(msg){
      this.setMessage ( msg )
    },
    '$store.state.user.login':function(login){
      this.logged = login
      if ( !login ) this.$router.push ( 'login' )
    },
    message(v){
        //display message, if null or empty close 
        if ( v ){
            window.setTimeout(()=>{ 
              this.message = ''
              this.$store.dispatch('message','') 
            }, 4000)
        }
    },
  },
  methods: {
    setMessage(msg){
      this.message = msg
    },
  },
  mounted(){
    this.$api.authenticate().then ( res => {
        this.$store.dispatch('login',true)
        console.log ( 'Authenticated !')
      }).catch ( error => {
        this.$router.push ( '/login' )
    })
    this.$api.service ( 'collections' ).find ( { query: { collection: 'help' } } ).then ( res => {
      this.$store.dispatch ( 'dataset' , { table: 'help' , data: res.data[0] }) 
    })
  }
}
</script>

<style>
body {
  background: rgb(214, 214, 214);
}

::-webkit-scrollbar {
    width: 8px;
    height: 5px;
  }
  ::-webkit-scrollbar-button {
    width: 0px;
    height: 0px;
  }
  ::-webkit-scrollbar-thumb {
    background: #616161;
    border: 0px none #ffffff;
    border-radius: 50px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #313131;
  }
  ::-webkit-scrollbar-thumb:active {
    background: #616161;
  }
  ::-webkit-scrollbar-track {
    background: #3a3a3a;
    border: 0px none #ffffff;
    border-radius: 40px;
  }
  ::-webkit-scrollbar-track:hover {
    background: #616161;
  }
  ::-webkit-scrollbar-track:active {
    background: #1f1e1e;
  }
  ::-webkit-scrollbar-corner {
    background: transparent;
  }
</style>