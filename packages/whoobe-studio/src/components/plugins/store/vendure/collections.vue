<template>
    <div v-if="collections" class="flex flex-row cursor-pointer z-highest my-4 mb-8">
        <template v-for="collection in collections">
            <div v-if="collection.name.toLowerCase() !='home' && collection.parent.name==='__root_collection__'" class="p-2 border flex flex-col relative mr-2 h-8 justify-center items-center" @click="setCollection(collection.name)">
                    {{ collection.name }}
                    <div v-if="!$attrs.reload && selected && collection.children && selected === collection.name" class="flex flex-col  absolute top-0 mt-8 w-64 border border-t-0 shadow left-0 bg-white text-black z-highest items-start justify-start" @mouseleave="selected=null">
                        <template v-for="child in collection.children">
                            <div class="hover:bg-black hover:text-white p-1 w-full" @click="filterCollection(child.name)">{{ child.name }}</div>
                        </template>
                    </div>
            </div>
        </template>
        
    </div>
</template>

<script>
import queries from './queries'
export default {
    name: 'VendureCollections',
    data:()=>({
        query: '',
        collections: null,
        selected: '',
        childName: ''
    }),
    methods:{
        qry(){
            this.$loading ( true )
            fetch('http://localhost:3000/shop-api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: this.query })// 'query Products { products { items { name } } }' }),
                })  
                .then(response => response.json())
                .then( data => {
                    this.collections = data.data.collections.items
                    this.$loading()
            })
        },
        setCollection(name){
            this.selected = name

        },
        filterCollection(name){
            this.selected = null
            this.$emit('collection',name)
            this.selected = null
        }
    },
    watch:{
        '$attrs.reload':function(v){
            this.selected = v
        }
    },
    mounted(){
        this.query = queries.collections
        this.qry()
        this.selected = this.$attrs.reload
    }
}
</script>