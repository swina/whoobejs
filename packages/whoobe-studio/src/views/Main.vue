<template>
    <div class="cursor-pointer bg-gray-800 bg-center bg-cover bg-no-repeat h-screen w-screen flex flex-col items-center justify-center" title="Click to start" style="background-image:url(https://res.cloudinary.com/moodgiver/image/upload/v1616863115/desktop-1155613_1920_eimtxw.jpg);">
      <div class="m-auto text-center font-thin  m-auto">
        <img src="../assets/logo.svg" class="w-64 grayscale"/>
        <div class="text-gray-700 text-sm -mt-4w-64 text-right font-hairline">S T U D I O</div>
        <button v-if="$store.state.user.login" @click="$router.push('desktop')" class="text-2xl p-4">Start</button>
        <!-- <div class="tex-left">
          <login v-if="!logged" @islogged="check" class="m-auto w-64"/>
        </div> -->
      </div>
      <!--<div v-if="!$store.state.user.login" class="z-1 fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50"></div>
      <transition name="fade">
            <div class="modal z-2 bg-white w-full md:w-1/4 text-lg flex flex-col rounded" v-if="login">
                  <div class="w-full p-1 bg-black text-white rounded-tl rounded-tr">Login</div>
              <div class="p-4 flex flex-col">
                  <label>Email</label>
                  <input type="email" v-model="userLogin.email"/>
                  <label>Password</label>
                  <input type="password" v-model="userLogin.password"/>
                  <button class="my-4 mx-auto text-xl rounded" @click="doLogin()">Login</button>
              </div> 
            </div>
      </transition>-->
    </div>
</template>


<script>
import jp from 'jsonpath'
import { mapState } from 'vuex'
export default {
  name: 'Main',
  data:()=>({
    userLogin: {
      email: '',
      password: '',
    },
    login: false,
  }),
 
  mounted(){
    let vm = this
    // this.$api.authenticate().then ( resp => {
    //   vm.login = false
    //   this.$store.dispatch('login',true)
    // }).catch ( err => {
    //   this.$message ( 'Authentication required!' )
    //   this.login = true
    //   this.$store.dispatch('login',false)
    //   console.log ( err )
    // })

  },
  methods:{
    datastore(){
      this.$loading(true)
      this.$find('plugins') 
      this.$find('settings')
      this.$find('setup')
      this.$find('elements')
      this.$find('workspace')
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
            $select : ['_id', 'title' , 'slug' , 'template_id' , 'homepage' , 'active' ] 
          }
        }
      ).then ( result => {
        this.$loading()
        this.$store.dispatch ( 'dataset' , { table: 'articles' , data: result.data })
        // let elements = this.$mapState().datastore.dataset.elements[0].moka 
        // Object.keys ( elements ).forEach ( group => {
        //   if ( group != 'keys' && group != 'categories' ){
        //     elements[group].forEach ( element => {
        //       let el = element
        //       el.category = group
        //       this.$api.service ( 'block-elements' ).create ( el )
        //     })
        //   }
        // })
      })
    },
    doLogin(){
        this.$api.authenticate({
            email: this.userLogin.email,
            password: this.userLogin.password,
            strategy: 'local'
        }).then ( resp => {
            this.$message ( 'Welcome to Whoobe !')
            this.login = false 
            this.$store.dispatch('login',true)
        }).catch ( err => {
            console.log ( err )
            this.$store.dispatch('login',false)
            this.$message ( 'Login error! Check your credentials')
        })
      }
  },
  
}
</script>
<!--
<script>
import { mapState } from 'vuex'
export default {
  name: 'Main',
  data:()=>({
    logged: false
  }),
  components: {
    'login' : () => import ( '@/components/common/login.vue')
  },
  computed:{
    ...mapState ( ['user'] ),
    islogged(){
      this.logged = this.user ? true : false
      return this.$store.state.user
    }
  },
  methods:{
    check(status){
      this.logged = status
    }
  },
  mounted(){
    console.log ( this.$mapState().datastore.dataset.elements[0].moka )
    this.logged = this.$store.state.user ? true : false
  }
  
}
</script>
-->