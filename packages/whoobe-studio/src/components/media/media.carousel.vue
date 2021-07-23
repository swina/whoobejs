<template>
    <div class="flex-row-center w-full theme-dark justify-start flex-wrap cursor-pointer ">
        <draggable v-if="gallery || galleryImages.length" class="mt-2 theme-dark h-40 w-full p-4 flex flex-row flex-wrap items-center justify-start relative">
            <template v-for="(img,i) in galleryImages">
                <img
                    :key="i"
                    :src="$imageURL(img)"
                    class="h-24 w-32 object-cover mx-2 shadow object-center cursor-move" 
                    @dblclick="galleryImages.splice(i,1)" title="drag to reorder, dblckick to remove"/> 
            </template>
            <div class="w-full absolute bottom-0 text-center">
                <button class="mx-2" v-if="galleryImages" @click="clearCarousel()">Clear</button>
                <button @click="((setCarousel(galleryImages)),(selected=galleryImages))">Set Carousel</button>
            </div>
        </draggable>
    </div>
</template>
<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'
export default {
    name: 'MediaCarousel',
    components: { draggable },
    props:['files'],
    computed:{
        ...mapState( ['editor'] ),
        gallery(){
            if ( this.editor.current.gallery && this.editor.current.gallery.images.length ){
                this.galleryImages = this.editor.current.gallery.images
                return true
            }
            return false
        }
    },
    methods: {
        setCarousel(){
            this.editor.current.gallery.images = this.galleryImages
        },
        clearCarousel(){
            this.editor.current.gallery = null
        }
    }
}
</script>