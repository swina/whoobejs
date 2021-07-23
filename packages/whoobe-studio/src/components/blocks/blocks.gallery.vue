<template>
  <div class="w-full theme-dark">
    <div v-if="!$attrs.mode" class="bg-gray-900 sticky top-0 p-2 w-full flex flex-row items-center justify-start">
      <button class="lg" @click="$action('component_create')">New</button>
      <button class="lg" @click="$action('component_import')">Import</button>
      <button class="lg" @click="$mapState().editor.export='category',$action('component_export')">Export All</button>
      <input class="dark mt-1 ml-2" type="text" placeholder="search..." v-model="search" @keydown="searchComponent($event)"/>
      <button v-if="search" @click="search='',blocks=objects">Reset</button>
    </div>
    <div v-if="objects" class="px-2 py-4 m-auto whoobe-components-gallery flex flex-row flex-wrap justify-center ">
      <!-- GALLERY -->
      <div v-for="comp in blocks" class="mx-4 my-4 w-48" :title="comp.name + '-' + comp.description + ' ' + comp.updatedAt" :key="comp._id">
        <!-- <div v-if="comp && comp.hasOwnProperty('name')"> -->
          <div class="pl-1 h-7 text-xs text-gray-400" @click="editName(comp)">
            {{ comp.name.substring(0,20) }} 
          </div>

          <div class="w-48 h-56 flex flex-col items-center justify-center border border-gray-700" @click="selectComponent(comp.id, 'component', comp)">
              <img v-if="comp.image"
                :class="'image_' + comp._id"
                class="object-cover object-top object-left w-48 h-56"
                :src="$imageURL(comp.image)"
                title="Click to edit"
                />
              <icon v-if="!comp.image" name="view_quilt" class="text-8xl m-auto"/>
              
          </div>

          <!--ACTIONS-->
          <div class="text-xs text-gray-600 opacity-0 hover:opacity-100" @mouseleave="moreID = null">
            <div>
              <div v-if="moreID === comp._id" @mouseleave="moreID = null" class="menu absolute -translate-y-48 h-48 transform bg-gray-900 w-48">
                <div class="pl-1 hover:bg-white" title="Change name" @click="editName(comp)">
                  Name ...
                </div>

                <div class="pl-1 hover:bg-white" title="Change category" @click="editCategory(comp)">
                  Category ...
                </div>
                <div class="pl-1 hover:bg-white" title="Change name" @click="component=comp,createArticle=!createArticle">
                  Create article ...
                </div>
                <div class="pl-1 hover:bg-white" :class="comp.hasOwnProperty('autosave') && comp.autosave ? '' : 'italic'" @click="comp.hasOwnProperty('autosave') && comp.autosave ? restoreAutosave(comp) : null" title="Restore from autosave">
                  Restore
                </div>
                <div class="pl-1 hover:bg-white" @click="addToLibrary(comp, 'library')" title="Export">
                  Add to export
                </div>
                <div class="pl-1 hover:bg-white" @click="duplicateComponent(comp)" title="Duplicate">
                  Duplicate
                </div>
                <div class="pl-1 hover:bg-white" @click="(current = comp),(confirmModal = !confirmModal)">
                  Delete
                </div>
              </div>
              <div class="w-full p-1 flex flex-row justify-around">
                <i class="material-icons xs mr-2 hover:text-blue-500" title="Edit" @click="selectComponent(comp.id, 'component', comp)">edit</i>
                
                <i class="material-icons xs ml-2 hover:text-blue-500" title="Preview" @click="openPreview(comp)">preview</i>

                <i class="material-icons" @click="moreID = comp._id">more_vert</i>
              </div>
            </div>
          </div>
        <!-- </div> -->
      </div>
    </div>
    <!-- DELETE OBJECT MODAL -->
    <transition name="fade">
        <modal
            :fixed="true"
            size="sm"
            position="modal" 
            :close="true"
            v-if="confirmModal"
            @close="confirm=false,confirmModal=false,$action()"
            @click_0="confirm=false,confirmModal=false,$action()"
            @click_1="confirm=true,confirmModal=!confirmModal,removeComponent()">
            <div slot="title">Delete object</div>
            <div slot="content" class="p-4">
                Remove <strong>{{current.name}}</strong> ?
            </div>
        </modal>
    </transition>
    <modal-confirm 
      v-if="confirm" 
      @noconfirm="confirm=!confirm" 
      @confirm="confirmAction"/>
    <modal
      v-if="componentName"
      size="md"
      @close="componentName=!componentName">
      <div slot="title">Block name</div>
      <div slot="content" class="p-4 flex flex-row justify-around">
        <input type="text" class="dark" v-model="component.name"/><button @click="saveComponent(component)">Save</button>
      </div>
    </modal>
    <modal
      v-if="componentCategory"
      size="md"
      @close="componentCategory=!componentCategory">
      <div slot="title">Block category</div>
      <div slot="content" class="p-4 flex flex-row justify-around">
        <select v-model="component.category" class="dark mr-2">
          <option v-for="category in $mapState().datastore.components_categories" :value="category.filter" class="capitalize"><span class="capitalize">{{ category.label }}</span></option>
        </select><button @click="saveComponent(component)">Save</button>
      </div>
    </modal>
    <modal
      v-if="createArticle"
      size="md"
      buttons="standard"
      @close="createArticle=!createArticle"
      @click_0="createArticle=!createArticle"
      @click_1="createNewArticle()"
      >
      <div slot="title">Create article</div>
      <div slot="content" class="p-6">
        Click OK to create a new article with this block as template
      </div>

    </modal>
  </div>
</template>

<script>
export default {
    name: 'BlocksGallery',
    props: [ 'objects' ],
    data:()=>({
        allObjects: null,
        moreID: null,
        currImage: null,
        current: null,
        blocks: null,
        confirmModal: false,
        confirm: false,
        confirmAction : null,
        search:'',
        componentName: false,
        componentCategory: false,
        component: null,
        createArticle: false
    }),
    methods:{
      editName(component){
        this.component = component
        this.componentName = true
      },
      editCategory(component){
        this.component = component
        this.componentCategory = true
      },
      saveComponent(component){
        let vm = this
        this.$api.service('components').patch ( component._id , component ).then ( res => {
          vm.blocks = vm.allObjects.filter ( obj => obj.category === this.$attrs.filter )
        })
        this.componentName = false
        this.componentCategory = false
      },
      addToLibrary(){
        return
      },
      searchComponent(e){
        if ( e.keyCode === 13 && this.search.length > 2){
          
          this.blocks = this.allObjects.filter ( obj => {
            console.log ( obj.name )
            return obj.name.toLowerCase().indexOf(this.search) > -1 // || obj.tags.toLowerCase().indexOf(this.search) > -1
          })
        }
      },
      duplicateComponent ( block ){
        let duplicateObject = JSON.parse( JSON.stringify(block) )
        duplicateObject.name = duplicateObject.name + ' COPY'
        delete duplicateObject._id
        this.$api.service ( 'components' ).create ( duplicateObject ).then ( res => {
          this.$emit('duplicated')
        })
      },
      selectComponent ( id , mode , block ){
          this.$mapState().desktop.tabs.push (
              {
                  component: 'blocks/editor/block.editor',
                  name: block.name,
                  filter: '',
                  mode: 'block',
                  icon: 'edit',
                  blocks: block,
              }
          )
          this.$store.dispatch ( 'mode' , 'editor' )
          this.$mapState().editor.current = block.json
          this.$mapState().editor.component = block
          this.$mapState().desktop.currentTab = this.$mapState().desktop.tabs.length - 1
          window.localStorage.setItem('whoobe-desktop',JSON.stringify(this.$mapState().desktop.tabs))
          return
      },
      openPreview(component){
            this.$mapState().editor.preview = component
            window.localStorage.setItem('whoobe-preview',JSON.stringify(component.json))
            //)
            window.localStorage.setItem('whoobe-component',JSON.stringify(component))
            let route = this.$router.resolve({path: '/preview'});
            let w = window.open(route.href, 'whoobe','width=' + window.screen.availWidth );
            w.focus()
      },
        restoreAutosave ( block ){
          this.confirmAction = () => {
            this.confirm = false
            console.log ( block.autosave ? block.autosave : 'no autosave')
            console.log ( 'confirmed' )
          }
          this.confirm = true
          return
      },
      saveToLibrary ( block ){
          return
      },
      removeComponent ( ){
        this.$loading(true)
        this.$api.service ( 'components' ).remove ( this.current._id ).then ( res => {
          console.log( 'removed => ' , res)
          this.$emit('removed')
          this.$loading ( false )
        })
      },
      createNewArticle(){
            let article = {}
            article.title = this.component.name
            article.slug = this.$slugify(this.component.name)
            article.publish = true
            article.component = this.component._id
            article.content = ''
            article.excerpt = ''
            article.seo_title = this.component.seo.title
            article.seo_description = this.component.seo.description
            article.template_id = this.component._id
            article.template_preview = this.component.image
            article.categories = 'page'
            let blocks = this.component
            delete blocks.autosave
            article.blocks = blocks
            this.$api.service ( 'articles' ).create ( article ).then ( res => {
                this.$message ( 'Article created!' )
                this.$mapState().datastore.dataset.articles.push ( res )
            }).catch ( error => {
                this.$message ( 'An error occurred. Check you console log')
            })
        }
    },
    watch:{
      objects(v){
        this.allObjects = v
        this.blocks = v
      }
    },
    mounted(){
        this.blocks = this.objects.filter ( obj => {
            return obj.hasOwnProperty ( 'name' )
        })
        this.allObjects = this.objects
    }

}
</script>