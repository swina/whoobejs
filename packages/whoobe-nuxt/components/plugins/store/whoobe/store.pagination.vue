<template>
    <div class="flex flex-row w-full items-center justify-center whoobe-store-pagination">
        <!-- {{ settings.general.display.navigation.name }}  -->
        <template v-for="page in pages">
            <div :class="settings.general.display.pagination.css + ' ' + activePage(page)" @click="$emit('page',start=(page-1)*limit)">{{ page }}</div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'WhoobeStorePagination',
    props: ['settings'],
    data : ()=>({
        pages: 0,
        start:0,
        limit:0
    }),
    methods:{
        activePage(page){
            if ( (page-1) * this.limit === this.start ){
                return 'animate-pulse'
            }
        }
    },
    mounted(){
        this.pages = this.$attrs.pages
        this.start = this.$attrs.start
        this.limit = this.$attrs.limit
    }
}
</script>