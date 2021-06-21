<template>
  <div id="app">
    <block-preview v-if="page" :doc="page.component.json"/>
    <transition name="fade">
        <div style="transform: translateX(-50%);left:50%;" class="border-l-4 border-blue-500 fixed bottom-0 m-auto shadow-xl mb-12 bg-white text-gray-800 text-base p-4 w-1/2  z-highest" v-if="message">   
        {{ message }}
        </div>
    </transition>
  </div>
</template>

<script>
//import Page from '../config.json'
//var pg
export default {
  name: 'Whoobe',
  data:()=>({
    message: '',
    whoobe: null
  }),
  metaInfo(){
    return  {
     title: this.whoobe ? this.whoobe.component.seo.title : 'Whoobe' ,
     titleTemplate: '%s | Whoobe Landing Pages',
     meta : [
       { vmid: 'description', name: 'description' , content: this.whoobe ? this.whoobe.component.seo.description : 'Whoobe Landing Pages Visual Builder'}
     ]
    }
  },
  components: {
    'block-preview' : () => import ( './components/blocks/block.preview.vue' )
  },
  watch:{
     //when a new message diplay 
    '$store.state.whoobe.message':function(msg){
      this.setMessage ( msg )
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
  computed:{
    page(){
      return this.whoobe // Page
    }
  },
  methods: {
    setMessage(msg){
      this.message = msg
    },
  },
  beforeMount(){
    fetch ( import.meta.env.VITE_API_URL + 'config.json' )
        .then ( res => res.json() )
        .then ( page => {
          this.whoobe = page 
        })
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>