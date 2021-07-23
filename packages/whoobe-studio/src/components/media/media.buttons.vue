<template>
    <div class="sticky top-0 w-full bg-gray-900 flex flex-row items-center justify-start p-2">
        <button class="lg mr-1" @click="$emit('click','upload')" title="Upload image">Upload</button>
        <button class="lg mr-1" @click="$emit('click','pixabay')" title="Upload from Pixabay">Pixabay</button>
        <button class="lg mr-1" @click="$emit('cloudinary')" title="Upload to Cloudinary">Cloudinary</button>
        <button class="lg mr-1" @click="$emit('click','url')" title="Upload from URL">From URL</button>
        <button class="lg mr-1" @click="$emit('carousel')" title="Set Carousel">Carousel</button>
        <input class="dark mt-1 ml-2 mr-1" type="text" placeholder="search..." v-model="search" @keydown="searchMedia($event)" title="Enter a keyword and press Return"/>
        <button class="lg mr-1" @click="search='',$emit('search','')">Reset</button>
        <button class="lg mr-1" @click="$emit('folder','products')">Store</button>
        <!-- <label>Import from url</label>
        <input type="text" class="ml-2 w-64" placeholder="url"/> -->
    </div>
</template>
<script>
export default {
    name: 'MediaButtons',
    data:()=>({
        search: ''
    }),
    methods:{
        searchMedia(e){
            if ( (e.keyCode === 13 && e.target.value.length > 2) || e.target.value.length > 2 ){
                this.$emit('search',this.search)
            }
        }
    }
}
</script>
