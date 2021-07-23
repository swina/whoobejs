<template> 
  <div>
    <client-only>
      <blocks-block-preview v-if="homepage" :doc="homepage.blocks.json"/>
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'WhoobeHomepage',
  data:()=>({
    homepage: null,
    template:null,
    loaded: false
  }),
  
  head(){
        let seo = {
          title: this.homepage.seo_title,
          description : this.homepage.seo_description
        }
        this.$store.dispatch('seo_title' , seo.title )
        this.$store.dispatch('seo_description', seo.description )
        return {
            title: seo.title,
            meta: [
                // hid is used as unique identifier. Do not use `vmid` for it as it will not work
                { 
                  hid: 'description',
                  name: 'description', 
                  content: seo.description,
                }
            ]
        }
        
        
  },
  computed: {
    ...mapState( ['settings']),
  },
  async asyncData({app,route}){
        
      const articles = await app.$whoobe.service ( 'articles' ).find ( {
          query : {
              homepage : true
          }
      })
      return { 
          homepage : articles.data[0]
      }
  }
}
</script>
