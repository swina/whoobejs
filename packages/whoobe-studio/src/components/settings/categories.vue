<template>
    <div v-if="categories" class="m-2">
        <h4 class="capitalize">{{ type }} Categories</h4>
        <div class="flex flex-row flex-wrap p-2" title="click to add a new category">
            <template v-for="(category,i) in categories">
                <div title="click to manage facets" class="flex flex-row items-center mr-2 bg-purple-500 text-white rounded my-2 text-lg px-2 py-1 capitalize">{{ category.name }} <icon name="edit" class="ml-2" @click="index=i,selected=category,getFacets(category._id)"/> <icon name="close" class="ml-2" @click="deleteCategory(category)"/></div>
            </template>
            <input type="text" class="new_category text-lg bg-gray-800" placeholder="add category" v-model="newCategory" @keydown="addCategory($event)"/>
        </div>
        <div v-if="selected" class="p-8 text-lg">
            <label>Name</label>
            <input class="dark" type="text" v-model="categories[index].name"/>
            <label>Slug</label>
            <input class="dark" type="text" v-model="categories[index].slug"/>
            <toggle :status="categories[index].active" v-model="categories[index].active" @click="setStatus" label="Active" css="text-purple-600"/>
            <button class="lg">Save</button>
        </div>
        <div v-if="selected" class="bg-purple-500 text-white text-lg p-2">{{ selected.name }} Facets</div>
        <div v-if="facets" class="flex flex-row flex-wrap p-2 bg-gray-200 text-black border" title="click to add a new facet">
            <template v-for="category in facets">
                <div title="click to manage facets" class="flex flex-row items-center mr-2 bg-teal-500 text-white rounded my-2 text-lg px-2 py-1">{{ category.name }} <icon name="close" class="ml-2"/></div>
            </template>
            <input type="text" class="new_facet text-lg bg-gray-200" title="Enter to save" placeholder="click to add" v-model="newFacet" @keydown="addFacet($event)"/>
        </div>
       
    </div>
     <!-- <div class="m-4 p-2 bg-gray-100 flex flex-col">
        <div class="grid grid-cols-2 grid-flow-row items-center" style="grid-template-columns:1fr .2fr .6fr .2fr;">
            <h3 class="">
                Categories
            </h3> 
        </div>
        <div class="flex flex-col text-sm">
            <div class="grid grid-cols-3 gap-4 w-1/2 bg-gray-200 p-2">
                <div class="font-bold mr-2">Category</div>
                <div class="font-bold">Slug</div>
                <div></div>
            </div>
            <div class="grid grid-cols-3 gap-4 w-1/2 border p-2 items-center">
            <template v-for="cat in datastore.dataset.setup[0].categories.articles">
                <div><input class="w-full" type="text" v-model="cat.name" @keyup="slugit(cat.name,cat)"/></div>
                <div><input class="w-full" type="text" v-model="cat.slug" readonly/></div>
                <div><i class="material-icons" title="Save" @click="save(cat)">save</i></div>
            </template>
                <div class="col-span-3">
                    Add category
                </div>
                <div>
                    <input class="w-full" type="text" v-model="category.name" placeholder="new category" @keyup="slugit(category.name,category)"/>
                </div>
                <div>
                    <input class="w-full" type="text" v-model="category.slug" readonly/>
                </div>
                <div>
                    <button title="Add" @click="add(category)">Add</button>
                </div>
           </div>
        </div>
    </div> -->
</template>

<script>
import { mapState } from 'vuex'
export default { 
    name: 'WhoobeCategories',
    components: {
        'toggle' : () => import ( '@/components/common/switch.vue' )
    },
    data:()=>({
        type: 'block',
        index:null,
        categories: null,
        facets: null,
        newCategory:  '',
        newFacet: '',
        selected: null
    }),
    computed:{
        ...mapState ( ['datastore'])
    },
    methods:{
        setCategory(){
            let categories = Object.keys ( this.selected ).filter ( cat => {
                return this.selected[cat] 
            })
            console.log ( categories )
            categories = categories.map ( cat => {
                return cat = cat.split('|')
            }).join(',').split(',')
            let cats =  [ ...new Set(categories) ] 
            console.log ( cats )
        },
        setStatus(status){
            this.categories[this.index].active = status
        },
        getFacets(id){
            this.$api.service ( 'categories' ).find ( { query : { collection: id } } ).then ( res => {
                this.facets = res.data
            })
        },
        slugit(txt,cat){
            cat.slug = this.$slugify(txt)
        },
        save(category){
            this.$api.service('categories').patch ( category.id , category ).then ( result => {
                this.$store.dispatch ( 'message' , 'Category saved' )
                this.$find('setup')
            })
        },
        addCategory(e){
          if ( e && e.target.value && e.target.value.length > 2 ){
            if ( e.keyCode === 13 ){
              let category = {
                name: this.newCategory.toLowerCase(),
                slug : this.$slugify ( this.newCategory.toLowerCase() ),
                type: this.type
              } 
            
              this.$api.service ( 'categories').create ( category ).then ( result => {
                  this.$store.dispatch ( 'message' , 'Category added' )
                  this.newCategory = ''
                  this.categories.push ( result )
              })
            }
          }
        },
        deleteCategory(category){
          if ( this.type === 'block' ){
            this.$api.service ( 'components' ).find ( { query: { category : category.name } } ).then ( res => {
              if ( res.data.length ){
                this.$message ( 'You can\'t delete a category with associated data.' )
              } else {
                this.$api.service ( 'categories' ).remove ( category._id ).then ( res => {
                  this.$message ( 'Category deleted' )
                  this.categories = this.categories.filter ( cat => cat._id != res._id )
                })
              }
            })
          }
        }
    },
    mounted(){
        if ( this.$attrs.type ) this.type = this.$attrs.type
        this.$api.service('categories').find ( { query: { $limit:50 , type: this.type , $sort : { name: 1} } } ).then ( res => {
            this.categories = res.data
        })
    }
}
</script>