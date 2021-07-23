<template>
    <div class="flex flex-col items-center justify-center">
        <draggable :list="carouselImages" group="gallery" v-if="carousel && $mapState().editor.action==='media'"  class="border-4 border-dashed flex flex-row h-10 justify-center items-center my-2 w-full">
            Drag here or click on the image to add to carousel
        </draggable>
        <draggable  :list="files" :group="{ name: 'gallery', pull: 'clone', put: false }" class="flex-row-center theme-dark justify-center flex-wrap cursor-pointer p-2">
            <div v-for="image in files" :key="image._id" class="w-48 mx-4 my-4 flex flex-col justify-center text-xs">

                <img v-if="$isFileType(image.mime)==='image'" :src="$imageURL(image)" class="h-32 w-48 object-cover shadow-lg" @click="($mapState().editor.image=image),$emit('image',image)" :title="image.url"/>

                <img v-if="$isFileType(image.mime)==='video'" :src="$imageURL(image)" class="h-32 w-48 object-cover shadow-lg" @click="($mapState().editor.image = image),$emit('image',image)" :title="image.url"/>

                <icon v-if="$isFileType(image.mime)!='video' && $isFileType(image.mime)!='image'"  name="insert_drive_file" class="m-auto text-7xl h-32 flex flex-col items-center justify-center" :title="image.url"/>
                <div class="relative">{{ image.name.substring(0,30) }} 
                    <span v-if="image.provider!='local'" class="text-red-500 absolute right-0">ext</span>
                    <span v-else class="text-lime-500 absolute right-0">local</span>
                </div>
                <div class="h-3 flex-row-center justify-between leading-6">
                    {{ image.width }}x{{ image.height }} 
                    <span class="uppercase">{{ image.ext }} </span>
                    <span>{{ parseInt(image.size/1000) }}KB </span>
                </div>
            </div>
        </draggable>

    </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
    name: 'MediaGallery',
    components: { draggable },
    props: [ 'files' , 'carousel' ],
    data:()=>({
        carouselImages: null
    }),
    methods:{
    },
    mounted(){
        if ( this.$mapState().editor.current && this.$mapState().editor.current.gallery ){
        this.carousel ?
            this.carouselImages = this.$mapState().editor.current.gallery.images : null
        }
    }
}
</script>