<template>
    <block-preview v-if="page" :doc="page.json"/>
</template>

<script>
//import Page from '../config.json'
//var pg
export default {
  name: 'WhoobeHome',
  data:()=>({
    message: '',
    whoobe: null
  }),
  components: {
    'block-preview' : () => import ( './blocks/block.preview.vue' )
  },
 
  computed:{
    page(){
      this.$store.dispatch ( 'meta' , this.whoobe.seo )
      return this.whoobe // Page
    }
  },
  beforeMount(){
    this.whoobe = Page 
  },
};
</script>

