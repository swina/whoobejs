<template>
    <div v-if="currentArticle" class="theme-dark relative">
        <div class="sticky bg-gray-900 top-0 -mt-2 p-2 w-full z-2xtop">
            <button class="lg" @click="$emit('delete',currentArticle._id)">Delete</button> 
            <!--<button class="lg" @click="$emit('close')">Import WP</button>
            <button class="lg" @click="$emit('close')">Export</button>  -->
            <button class="lg" @click="preview()">Preview</button> 
            <button class="lg" @click="saveArticle">Save</button> 
            <!-- <button class="lg" @click="$emit('close')">Create New</button> -->
            <icon name="close" css="absolute right-0 -mt-10 text-3xl text-gray-300" @click="$emit('close')"/>
            <!-- <button class="lg absolute right-0 mr-12" @click="saveArticle">Save</button>  -->
        </div>
        <!-- /** 
        * !Edit article 
        */
        -->
        <transition name="fade">
                     
            <div v-if="currentArticle" class="flex flex-row  p-1 relative overflow-y-auto">
                <section class="w-4/5 container relative text-sm" v-if="currentArticle">
                    
                    <label>Title <span class="text-gray-400">#{{ currentArticle.id }}</span></label>
                    <input type="text" class="dark w-full text-2xl" v-model="currentArticle.title" @change="currentArticle.slug=$slugify(currentArticle.title)"/>
                    <label>Slug </label>
                    <input type="text" class="dark w-full text-2xl" v-model="currentArticle.slug" @blur="$slugify(currentArticle.title)"/>
                    <label>Excerpt</label>
                    <textarea class="dark text-sm w-full" v-model="currentArticle.excerpt"></textarea>
                    <label>Content</label>
                    <block-text-editor v-model="currentArticle.content" size="h-4/5" :embeded="true" :article="currentArticle" v-if="!fullscreen" @fullscreen="fullscreen=!fullscreen"/>
                    <modal-fullscreen
                        class="bg-white"
                        @close="fullscreen=!fullscreen"
                        v-if="fullscreen">
                        <div slot="title">Editor</div>
                        <block-text-editor slot="content" v-model="currentArticle.content" size="h-screen" :embeded="true" :article="currentArticle" @fullscreen="fullscreen=!fullscreen"/>
                    </modal-fullscreen>

                </section>
            
            
                <div class="w-1/5 ml-4 shadow text-sm" v-if="currentArticle">
                    <!--<button class="warning mr-2" @click="editor=!editor">Close</button>
                    <button class="success mr-2" @click="save">Save</button>    
                    <button @click="wordpress=!wordpress">WP page</button>
                    <button @click="exportPage=!exportPage">Export</button>-->
                    <input type="checkbox" v-model="currentArticle.publish"/> Publish
                    <div class="flex flex-col" v-if="currentArticle.blocks">
                        <div class="text-white p-1">Template</div>
                        <div class="mb-2 flex flex-col items-center bg-white border">
                            <span class="text-xs" v-if="currentArticle.blocks">
                                    {{ currentArticle.blocks.name }}
                            </span>
                                

                            <img v-if="currentArticle.template_preview" :src="this.$imageURL(currentArticle.template_preview)" class="w-48 h-32 object-cover object-top cursor-pointer" @click="selectTemplate=!selectTemplate"/>
                            <img v-else src="../../assets/no-image.png" class="h-24 object-contain"/>
                            <button class="sm mb-2" @click="selectTemplate=!selectTemplate">Page / Template</button> 
                            <!--<img class="h-24 object-cover object-top cursor-pointer" :src="$imageURL(currentArticle.blocks.image_uri)"
                            v-if="currentArticle.blocks.image_uri" @click="selectTemplate=!selectTemplate"/>-->
                        </div>
                        <div class="mb-2 flex flex-col">
                            <div class="text-white mt-2 p-1">Category</div>
                            <select class="dark w-full" v-model="currentArticle.categories">
                                <option v-for="(category,c) in $mapState().datastore.dataset.categories.filter(a=>a.type==='article')" :value="category.name"> {{ category.name }} </option>
                            </select>
                        </div>
                    </div>
                        <div>
                            <!-- <div class="text-white mt-2 p-1">Homepage</div> -->
                            <input type="checkbox" v-model="currentArticle.homepage"/> 
                            Homepage
                        </div>
                        <div>
                            <!-- <div class="text-white mt-2 p-1">Homepage</div> -->
                            <input type="checkbox" v-model="currentArticle.store"/> 
                            Store main page
                        </div>
                        <div class="text-white mt-2 p-1">Featured image</div>
                        <div class="flex flex-col mb-2 h-32 items-center">
                            <div class="h-32 w-full flex p-1 justify-center" v-if="currentArticle.image">
                                <img v-if="currentArticle.image" :src="$imageURL(currentArticle.image)" class="h-24 object-cover" :title="currentArticle.image.name" @click="$action('media')"/>
                            </div> 
                            <button @click="media=!media" class="mt-1">Select Media</button>
                            <!-- <moka-image-placeholder :image="currentArticle.image" @click="$action('media')" size="sm" @media="$action(),editorImage=false" @noimage="currentArticle.image=null"/> -->
                        
                        </div>
                        
                        

                        <div class="text-white mt-2 p-1">SEO</div>
                        <div class="flex flex-col p-1">
                            <label>Title</label>
                            <input type="text" class="w-full dark" v-model="currentArticle.seo_title"/>
                            <label>Description</label>
                            <textarea class="text-sm w-full dark" v-model="currentArticle.seo_description"/>
                        </div>
                        <div class="text-white mt-2 p-1">Tags</div>
                        <textarea v-model="currentArticle.tags" class="dark h-16 w-full text-xs"></textarea>
                        <div class="text-xs text-gray-600">Set a tag per line</div>
                    
                </div>
                
            </div>
        </transition>

        <transition name="fade">
            <modal 
                v-if="selectTemplate" 
                size="lg" 
                position="modal"
                buttons="none"
                @close="selectTemplate=!selectTemplate">
                <div slot="title">Select template/block</div>
                <div slot="content">
                <block-templates 
                    :article="currentArticle"
                    @close="selectTemplate=false"/>
                </div>
            
            </modal>
        </transition>
        <transition name="fade">
            <modal-fullscreen 
                v-if="media"
                @close="media=!media">
                <div slot="title">Media</div>
                <div slot="content">
                    <media @close="media=false" @insertimage="setFeaturedImage"/>
                </div>
            </modal-fullscreen>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'ArticleEdit',
    components: {
        'block-text-editor' : () => import ( '@/components/blocks/editor/components/block.text.editor.vue' ),
        'block-templates'   : () => import ( './articles.templates.vue')

    },
    data:()=>({
        currentArticle: null,
        selectTemplate: false,
        fullscreen: false,
        media:false
    }),
    computed:{
        datastore(){
            return this.$mapState().datastore
        }
    },
    methods: {
        saveArticle(){
            !this.currentArticle.slug ? this.currentArticle.slug = this.$slugify(this.currentArticle.title ) : null
            this.$api.service ( 'articles' ).patch ( this.currentArticle._id , this.currentArticle ).then ( res => {
                this.$message ( 'Article updated!' )
            })
        },
        preview(){

            window.localStorage.setItem ( 'whoobe-article' , JSON.stringify(this.currentArticle) )
            window.localStorage.setItem ( 'whoobe-preview' , JSON.stringify ( this.currentArticle.blocks.json ) )
            window.localStorage.setItem ( 'whoobe-preview-id' , this.currentArticle.blocks._id )
            let route = this.$router.resolve({path: '/preview?mode=article'});
            let w = window.open(route.href, 'whoobe','width=' + window.screen.availWidth );
            w.focus()
        },
        setTemplate(){
            this.selectTemplate = false
        },
        setFeaturedImage(image){
            this.currentArticle.image = image
            this.media = false
        }
    },
    mounted(){
        //this.$mapState().datastore.currentArticle = this.$attrs.article
        this.currentArticle = this.$attrs.article
        !this.currentArticle.slug ?
            this.currentArticle.slug = this.$slugify(this.currentArticle.title) : null
        !this.currentArticle.hasOwnProperty ( 'content' ) ? this.currentArticle.content = '' : null
    }
}
</script>
