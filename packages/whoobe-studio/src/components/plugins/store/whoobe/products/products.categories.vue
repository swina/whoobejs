<template>
    <div v-if="categories" class="m-2">
        <h4>Categories</h4>
        <div class="flex flex-row flex-wrap p-2 bg-gray-200 text-black border" title="click to add a new category">
            <template v-for="category in categories">
                <div title="click to manage facets" class="flex flex-row items-center mr-2 bg-purple-500 text-white rounded my-2 text-lg px-2 py-1">{{ category.name }} <icon name="edit" class="ml-2" @click="selected=category,getFacets(category._id)"/> <icon name="close" class="ml-2"/></div>
            </template>
            <input type="text" class="new_category text-lg bg-gray-200" placeholder="" v-model="newCategory" @keydown="addCategory($event)"/>
        </div>
        <div v-if="selected" class="bg-purple-500 text-white text-lg p-2">{{ selected.name }} Facets</div>
        <div v-if="facets" class="flex flex-row flex-wrap p-2 bg-gray-200 text-black border" title="click to add a new facet">
            <template v-for="category in facets">
                <div title="click to manage facets" class="flex flex-row items-center mr-2 bg-teal-500 text-white rounded my-2 text-lg px-2 py-1">{{ category.name }} <icon name="close" class="ml-2"/></div>
            </template>
            <input type="text" class="new_facet text-lg bg-gray-200" title="Enter to save" placeholder="click to add" v-model="newFacet" @keydown="addFacet($event)"/>
        </div>
        <div class="p-4 m-10 mt-24 m-auto bg-gray-100 text-black text-center text-2xl">
            Removal of categories/facets can affect the product search and display. Before to remove checkout your products settings.
        </div>
    </div>
</template>

<script>
import NestedCategory from './products.nested.categories'
import jp from 'jsonpath'
export default {
    name: 'WhoobeProductsCategories',
    components: { NestedCategory },
    data:()=>({
        categories: null,
        facets: null,
        selected: null,
        newCategory: '',
        newFacet:''
    }),
    computed:{
    },
    methods:{
        setCategory(){
            let categories = Object.keys ( this.selected ).filter ( cat => {
                return this.selected[cat] 
            })
            console.log ( categories )
            categories = categories.map ( cat => {
                return cat = cat.split('|')
            }).join(',').split(',')
            let cats =  [ ...new Set(categories) ] 
            console.log ( cats )
        },
        getFacets(id){
            this.$api.service ( 'categories' ).find ( { query : { collection: id } } ).then ( res => {
                this.facets = res.data
            })
        },
        addCategory(e){
            if ( e.keyCode === 13 ){
                if ( e.target.value ){
                    let obj = {
                        name: e.target.value,
                        slug: this.$slugify(e.target.value),
                        type: 'product',
                        active: true
                    }
                    this.$api.service ( 'categories' ).create ( obj ).then ( res => {
                        this.categories.push ( res )
                        this.newCategory = ''
                        e.target.value = ''
                    })
                }
            }
        },
        addFacet(e){
            if ( e.keyCode === 13 ){
                if ( e.target.value ){
                    let obj = {
                        name: e.target.value,
                        type: 'facet',
                        slug: this.$slugify(e.target.value),
                        collection: this.selected._id
                    }
                    this.$api.service('categories').create ( obj ).then ( res => {
                        this.facets.push ( res )
                        this.newFacet = ''
                    })
                }
            }
        },
        rebuildCategories(){
            this.$api.service('products').find( { query : { $limit: 200 } } ).then ( res => {
                let json = jp.query(res.data,'$..facets')
                let categories = []
                let ct = ''
                json.forEach ( category => {
                    let cc = category.split('|')
                    let cleaned = '' 
                    cc.forEach ( c => {
                        console.log ( c )
                        !c.includes(':') ?
                            ct += c + ',' : null
                    })
                })
                categories.push ( ct )
                let c = categories[0].split(',')
                let builtCategories = [...new Set(c) ] 
                builtCategories.forEach ( category => {
                    if ( category ){
                        let obj = {
                            name: category,
                            type: 'product',
                            slug: this.$slugify(category),
                            active: true

                        }
                        this.$api.service('categories').create ( obj ).then ( res => {
                            console.log ( res )
                        })
                    }
                })
            })
        }
    },
    mounted(){
        this.$api.service ( 'categories' ).find ( { query: { $limit: 50 , type: 'product' , $sort: { name: 1 }} } ).then ( res => {
            this.categories = res.data
        })
        // let el = document.querySelector('.new_category')
        // el.addEventListener ( "keydown", e => {
        //     if ( e.keyCode === 13 ){
        //         let obj = {
        //             name: e.target.value,
        //             slug: this.$slugify(e.target.value),
        //             type: 'product',
        //             active: true
        //         }
        //         this.$api.service ( 'categories' ).create ( obj ).then ( res => {
        //             this.categories.push ( res )
        //             this.newCategory = ''
        //             e.target.value = ''
        //         })
        //     }
        // })
    }
}
</script>