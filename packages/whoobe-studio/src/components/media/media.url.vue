<template>
    <div class="p-4 w-full relative">
        <div class="p-2 border">
        <icon name="close" class="top-right mx-4 mt-6 text-3xl text-gray-200" @click="$emit('close')"/>
        <div class="flex flex-row">
            <label>Import from url</label>
            <input type="text" class="mx-2 w-3/4" placeholder="url" v-model="imageUrl"/>
            <button v-if="image" @click="$emit('save',image)">Save</button>
            <button v-if="$mode()==='block'" @click="$emit('image',image)">Select</button>
        </div>
        </div>
        <img v-if="image" :src="image.url" class="h-4/5 w-auto m-auto"/>
        <div v-if="image" class="m-auto">{{ image.width }} x {{ image.height }}</div>
    </div>
</template>

<script>
export default {
    name: 'MediaImageFromUrl',
    data:()=>({
        imageUrl: '',
        image: null
    }),
    watch:{
        imageUrl ( url ){
            if ( !url ) return 
            this.fetchImage ( url )
        }
    },
    methods:{
        fetchImage (url){
            if ( !url.includes('mp4') && !url.includes('webm') ){
                var imgURL = new Image();
                imgURL.src = this.imageUrl;
                let name = this.imageUrl.split(".");

                let ext = name[name.length - 1];
                name = "external";
                let width, height;
                imgURL.onload = () => {
                    this.image = {
                        url: this.imageUrl,
                        size: null,
                        width: imgURL.width,
                        height: imgURL.height,
                        ext: name,
                        name: name,
                        caption: "",
                        alternativeText: "",
                    };
                }
            } else {
                this.image = { url: this.imageUrl , name: 'Video URL' }
            }
        }
    }

}
</script>