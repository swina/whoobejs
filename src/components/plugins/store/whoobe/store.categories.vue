<template>
    <div class="flex flex-col md:flex-row" :class="$attrs.container" v-if="categories">
        <template v-for="category in categories">
            <div :class="$attrs.css" @click="$emit('category',category.name,false)">
                {{ category.name }}
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'WhoobeStoreCategories',
    data:()=>({
        categories: null
    }),
    mounted(){
        this.categories = this.$shop().categories.data
        // fetch(import.meta.env.VITE_API_URL + 'categories?$limit=50&type=product&$sort[name]=1')
        //     .then ( res => res.json() )
        //     .then ( categories => {
        //         this.categories = categories.data
        //     })
        // this.$api.service('categories').find( { query: { $limit: 50 , type: 'product' , $sort : { name: 1} }}).then ( res => {
        //     this.categories = res.data
        // })
    }
}
</script>