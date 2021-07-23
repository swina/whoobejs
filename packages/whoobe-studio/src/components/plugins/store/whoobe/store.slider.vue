<template>
    <div class="flex flex-row h-full w-full items-center justify-center whoobe-store-pagination">
        <!-- {{ settings.general.display.navigation.name }}  -->
        <div class="absolute h-full pr-10 top-0 left-0 w-10 flex flex-col items-center justify-center">
            <icon name="chevron_left" css="text-5xl" @click="$emit('cursor',start>0?start=start-limit:0)"/>
        </div>
        <div class="absolute h-full pl-10 top-0 right-0 w-10 flex flex-col items-center justify-center">
            <icon name="chevron_right" css="text-5xl" @click="$emit('cursor',(start+limit)<max?start=(start+limit):start=0)"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeStoreSlider',
    props: ['settings'],
    data : ()=>({
        pages: 0,
        start:0,
        limit:0,
        max: 9999
    }),
    methods:{
    },
    mounted(){
        this.pages = this.$attrs.pages
        this.start = this.$attrs.start
        this.limit = this.$attrs.limit
        this.max = parseInt(this.$attrs.max)
    }
}
</script>