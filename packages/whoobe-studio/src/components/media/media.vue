<template>
    <div v-if="files" class="theme-dark flex flex-col justify-start w-full items-center h-screen w-screen max-w-screen top-0 left-0 absolute pt-8 pl-10">
        <div v-if="mode==='gallery'" class="w-full">
            <media-buttons 
                @click="setMode" 
                @carousel="carousel=!carousel"
                @cloudinary="cloudinary=!cloudinary"
                @search="search"
                @folder="setFolder"/>
            
            <transition name="fade">
                <media-carousel v-if="carousel && $mapState().editor.action==='media'" :files="files" class="theme-dark"/>
            </transition>

            <media-gallery :carousel="carousel" :files="files" @image="setSelected" class="shadow-lg"/>
            
            <div class="grid grid-cols-3  items-center justify-center content-center">
                <div class="text-xs">
                   {{ skip+1 }} - {{ (parseInt(skip)+parseInt(limit)) }} of Files: {{ total }}
                </div>
                <navigation 
                size="4xl"
                @prev="skip>0?skip=skip-limit:null" 
                @next=" total - (skip+limit) > 0 ? skip=skip+limit:null"/>
                <div></div>
            </div>
            
        </div>

        <media-edit v-if="mode==='edit'"
             :image="selected" 
             @delete="deleteImage"
             @close="mode='gallery'"/>
        
        <media-upload
            :folder="folder"
            v-if="mode==='upload'"
            @uploaded="mode='gallery',mediaQry()"
            @close="mode='gallery'"
          />
        
        <media-pixabay
            v-if="mode==='pixabay'" 
            @close="mode='gallery'"
            :apikey="pixabayApiKey"/>

        <media-url
            v-if="mode==='url'"
            @save="uploadFromUrl"
            @image="setSelected"
            @close="mode='gallery'"/>

        <media-cloudinary
            v-if="cloudinary"
            @close="cloudinary=!cloudinary"
            :component="cloudinaryPlugin"
            :plugin="cloudinaryPlugin"/>

        <modal 
            v-if="selectFormat && currentImageFormat"
            size="lg"
            position="modal"
            buttons="none"
            @close="selectFormat=!selectFormat">
            <div slot="title">Select format</div>
            <div slot="content" class="flex flex-col p-2">
                <div class="relative">
                    <img :src="$imageURL(currentImageFormat.url)" class="w-full h-1/2 object-cover"/>
                    <div class="absolute z-top top-0 left-0 p-1 bg-black text-white font-mono text-xs">
                        {{ currentImageName }} - {{ currentImageFormat.width }}x{{ currentImageFormat.height}} - {{ currentImageFormat.size/1000 }}KB
                    </div>
                    <div class="absolute z-top bottom-0 w-full p-2 m-auto text-center">
                        <button class="lg rounded" @click="setSelectedFormat">Select</button>
                    </div>
                </div>
                <div class="flex flex-row">
                    <template v-for="format in Object.keys($mapState().editor.image.formats)">
                        <div class="flex flex-col m-2" @click="currentImageFormat=$mapState().editor.image.formats[format]">
                            <img :src="$imageURL($mapState().editor.image.formats[format].url)" class="h-40 w-40 object-cover"/>
                            <div class="text-xs flex flex-col"> 
                                <div>
                                    {{ $mapState().editor.image.formats[format].width }}x
                                    {{ $mapState().editor.image.formats[format].height }}
                                </div>
                                {{ $mapState().editor.image.formats[format].size/1000 }}KB

                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </modal>        
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Media',
    components: {
        'media-buttons' : () => import ( './media.buttons.vue' ),
        'media-carousel': () => import ( './media.carousel.vue' ),
        'media-gallery' : () => import ( './media.gallery.vue' ),
        'media-edit'    : () => import ( './media.edit.vue' ),
        'media-upload'  : () => import ( './media.upload.vue' ),
        'media-pixabay' : () => import ( '@/components/plugins/pixabay/pixabay.vue' ),
        'media-url'     : () => import ( './media.url.vue' ),
        'media-cloudinary' : () => import ( '@/components/plugins/cloudinary/cloudinary.widget.vue' )
    },
    data :()=>({
        mode: 'gallery',
        skip: 0,
        limit: 21,
        total:0,
        folder: '',
        files: null,
        selected: null,
        pixabayApiKey : null,
        carousel: false,
        cloudinary:false,
        cloudinaryPlugin: null,
        plugins: [],
        searchMedia: '',
        selectFormat: false,
        currentImageFormat: null,
        currentImageName: ''
    }),
    computed: {
        ...mapState(['editor','desktop'])
    },
    watch:{
        skip(v){
            if ( v )
                this.mediaQry()
        }
    },
    methods:{
        search(search){
            this.skip = 0
            this.folder = ''
            this.searchMedia = search
            this.mediaQry()
        },
        setMode(mode){
            this.cloudinary = false
            this.mode = mode
        },
        setFolder(folder){
            this.skip = 0
            this.folder = folder
            this.mediaQry()
        },
        mediaQry(){
            this.$loading(true)
            console.log ( this.searchMedia )
            let qry = {
                $skip : this.skip,
                $limit: this.limit,
                $sort: { updatedAt : -1 }
            }
            if ( this.searchMedia ){
                qry['$search'] = this.searchMedia
            } else {
                qry.folder = this.folder
            }
            
            this.$api.service ( 'media' ).find ( {
                query : qry
            }).then ( res => {
                this.$loading()
                this.total = res.total
                this.files = res.data
                // res.data.forEach ( media => {
                //     if ( media.url.includes('/products/') ){
                //         media.folder = 'products'
                //     } else {
                //         media.folder = ''
                //     }
                //     this.$api.service ( 'media' ).patch ( media._id , media )
                // })
            })
        },
        setSelected(image){
            if ( image.hasOwnProperty('formats') && Object.keys(image.formats).length ){
                this.currentImageFormat = image.formats.full
                this.currentImageName = image.name
                this.selectFormat = true
                return
            }
        },
        setSelectedFormat(){
            let image = this.currentImageFormat
            if ( this.$mode() === 'articles' ){
                this.$emit ( 'insertimage' , image )
                return
            }
            
            if ( this.$mode() === 'block' ){
                //console.log ( this.$mapState().editor.current.type , image )
                this.$mapState().editor.current.image = image
                this.$action()
                //this.$mapState().editor.current.image = image
                return
            } 
            if ( this.$mode() != 'media' ){
                if ( this.$mapState().editor.current.type === 'image' ){
                    this.$mapState().editor.current.image = image
                }
                this.$mapState().editor.current.image = image
                if ( this.$mapState().editor.current.type === 'video' ){
                    this.$mapState().editor.current.source = image
                }
                //window.localStorage.setItem('whoobe-image', JSON.stringify(image) )
                this.$store.dispatch('setCurrent',this.$mapState().editor.current)
                this.$action()
                //return
            }
            this.mode = 'edit'
            this.selected = image 
        },
        deleteImage(id) {
            this.$api
                .service("uploads/delete")
                .find({ query: { image: this.selected } })
                .then((result) => {
                console.log("deleted file => ", result);
            });

            this.$api
                .service("media")
                .remove(id)
                .then ( result => {
                    console.log ( result )
                })
            this.mode = 'gallery'
                
        },
        uploadFromUrl(image){
            console.log ( image )
            this.$api.service ( 'upload/file' ).create ( {
                url : image.url,
                name: this.$randomID()
            }).then ( res => {
                console.log ( res )
            }).catch ( err => {
                console.log ( err )
            })
            this.cloudinary = false
        },
        setLimit(width){
            width > 1450 ?
                this.limit = 32 :
                    width > 1266 ? 
                        this.limit = 18 :
                            width > 1170 ?
                                this.limit = 15 :
                                width > 866 ?
                                    this.limit = 12 :
                                        this.limit = 9 
            this.mediaQry()
        }
    },
    mounted(){
        this.setLimit ( window.innerWidth )
        window.addEventListener('resize',(event)=>{
            this.setLimit ( window.innerWidth )  
        })
        this.$api.service('media').on ( 'created' , () => {
            this.$message ( 'Media updated!' )
            this.cloudinary = false
            this.mediaQry()
        })
        this.$api.service('media').on ( 'removed' , () => {
            this.$message ( 'Media updated!' )
            this.cloudinary = false
            this.mediaQry()
        })
        // this.$mapState().editor.current && this.$mapState().editor.current.gallery ?
        //     this.carousel = true : this.carousel = false
        // this.$mapState().editor.action === '' ? this.carousel = false : null
        this.$mapState().datastore.dataset.plugins.map ( plugin => {
            if ( plugin.general.path === 'pixabay/pixabay' && plugin.component.config.apikey && plugin.general.enabled ){
                //this.pixabayPlugin = plugin.component
                this.pixabayApiKey = plugin.component.config.apikey
            }
            console.log ( plugin.general.path )
            if ( plugin.general.path === 'cloudinary/cloudinary.widget' && plugin.general.enabled ){
                this.cloudinaryPlugin = plugin
                this.plugins.push ( plugin )
            }
        })
        this.desktop.mode.includes('store') ?
            this.folder = 'products' : null
        this.mediaQry()
    }
}
</script>