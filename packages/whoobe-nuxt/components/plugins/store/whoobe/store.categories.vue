<template>
    <div class="flex flex-col" :class="classe" v-if="categories">
        <h4 class="border-b">Categories</h4>
        <div v-if="!$attrs.facets">
            <template v-for="category in categories">
                <div :class="$attrs.css" @click="group=category.slug">
                    {{ category.name }}
                </div>
            </template>    
        </div>
        <div v-else>
            <template v-for="category in categories">
                <div :class="$attrs.css" @click="group=category.slug">
                    <div class="flex flex-row relative items-center">
                        {{ category.name }}
                        <icon-extra :icon="group===category.slug?'akar-icons:minus':'mi:add'" class="absolute right-0 mr-2"/>
                    </div>
                    <transition name="fade">
                    <div v-if="$attrs.facets && ( group === category.slug || category.slug === $route.params.slug )" class="ml-4">
                        <template v-for="facet in facets">
                            <nuxt-link :to="'/store/category/' + category.slug + '/' + facet.slug">
                                <div v-if="facet.collection === category._id" :class="$attrs.facet === facet.slug ? 'font-bold':''">
                                    {{ facet.name }}
                                </div>
                            </nuxt-link>
                            <!-- <div v-if="facet.collection === category._id" @click="$emit('facet',facet.name,false)" :class="$attrs.facet === facet.name ? 'font-bold':''">
                                {{ facet.name }}
                            </div> -->
                        </template>
                        <nuxt-link :to="'/store/category/' + category.slug">
                            <div :class="!$attrs.facet?'font-bold':''">All</div>
                        </nuxt-link>
                    </div>
                    </transition>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeStoreCategories',
    data:()=>({
        group:'',
        categories: null,
        facets: null
    }),
    computed:{
        classe(){
            return this.$attrs.sidebar ?
                this.$attrs.css + ' w-full' : 'md:flex-row ' + this.$attrs.css
        }
    },
    // async asyncData({app}){
    //     const cats = await app.service('categories')
    //         .find ({
    //             query : {
    //                 $limit: 50,
    //                 type: 'product',
    //                 $sort: { name : 1 }
    //             }
    //         })
    //     return {
    //         categories: cats.data 
    //     }
    // },
    mounted(){
        this.categories = this.$store.state.categories.filter ( category => {
            return category.type === 'product'
        })
        this.facets = this.$store.state.categories.filter ( category => {
            return category.type === 'facet'
        })
        this.categories = this.categories.sort ( (a,b) => a.name - b.name )
        this.facets = this.facets.sort ( (a,b) => a.name - b.name )
    }
}
</script>