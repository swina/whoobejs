<template>
  <div class="flex flex-col p-2 rounded">
    <div class="text-sm">This block/document will be linked to a new page.</div>
    <div class="flex flex-col">
      <label>Title</label>
      <input class="w-full" type="text" v-model="page.title" />
      <label>Category</label>
      <select class="w-full text-black" v-model="page.categories">
        <option value=""></option>
        <option v-for="(category, c) in $datastore('setup').categories.articles" :value="category">
          {{ category }}
        </option>
      </select>
      <label>SEO Title</label>
      <input class="w-full" type="text" v-model="page.SEO.title" />
      <label>SEO Description</label>
      <textarea class="w-full" v-model="page.SEO.description" />
      <div class="my-2">
        <!--<button
          class="bg-gray-400 text-black mr-2"
          @click="createPage = !createPage"
        >
          Cancel
        </button>-->
        <button
          class="success"
          @click="createPage"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>    

<script>
export default { 
    name: 'MokaBlockPage',
    data:()=>({
        page: {
            title: 'new page',
            categories: [],
            template_id: '',
            SEO: {
                title: 'new page',
                description: 'A SEO description '
            }
        },
    }),
    methods:{
        createPage(page){
            page.SEO = {
                title : page.title,
                description: page.title + ' is another page'
            }
            this.$api.service ( 'articles' ).create ( page => { 
                this.$message ( 'The new article ' + page.title + ' has been created')
                this.$action()
            }).catch ( error => {
                this.$message ('An error occured. Please check your console log')
                this.$store.dispatch ( 'error' , error )
                this.$action('error')
            })
        }
    }
}
</script>