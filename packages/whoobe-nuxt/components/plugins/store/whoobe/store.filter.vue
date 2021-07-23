<template>
    <div class="w-full whoobe-store-filter">
        <div class="flex items-center">
            <input v-if="settings.general.display.search.enabled" type="text" :class="settings.general.display.search.css" :placeholder="settings.general.display.search.name" v-model="search" @keydown="productSearch($event)"/>
            <icon name="search" v-if="search.length > 2" class="mx-2 md:hidden" @click="$emit('search',search)"/>
        </div>

        <select v-model="sortBy" v-if="settings.general.display.sort.enabled" :class="settings.general.display.sort.css" class="whoobe-store-sort" @change="$emit('sort',sortBy)">
            <option value="">No sort</option>
            <option value="priceASC">Price UP</option>
            <option value="priceDESC">Price DOWN</option>
        </select>

        <div :class="settings.general.display.price_range.css" class="whoobe-store-price-range" v-if="settings.general.display.price_range.enabled">
            <double-range  :min="settings.general.display.price_range.min" :max="settings.general.display.price_range.max" @range="priceRange"/>
        </div>
    </div>
</template>

<script>

export default {
    name: 'WhoobeStoreFilter',
    data:()=>({
        search: '',
        sortBy: ''
    }),
    props:['settings'],
    components: {
        'double-range' : () => import ( '@/components/common/double.range.vue')
    },
    methods: {
        productSearch ( e ){
            if ( !e ){
                return
            } else { 
                if ( e.keyCode === 13 ){
                    if ( e.target.value.length > 2 ){
                        this.start = 0
                        this.$emit('search',this.search)
                        //this.qrySearch()
                    } else {
                        this.$emit('reset')
                        //this.qry()
                    }
                }
            }
        },
        priceRange(min,max){
            this.$emit('range',min,max)
        }
    },
    mounted(){
        this.sortBy = this.$attrs.sort
    }  
}
</script>