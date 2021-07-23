<template>
<div class="flex flex-col theme-dark max-h-screen">
    <div class="flex flex-row my-1 p-1 items-center">
        <span>Category</span> 
        <select v-model="filter" class="ml-2 w-full dark capitalize">
        <option v-for="category in $mapState().datastore.components_categories" :value="category.filter">{{ category.label }}</option>
    </select>
    </div>
    <div v-if="loadTemplates" class="relative overflow-y-auto flex flex-row flex-wrap justify-around p-4">
        <template v-for="(template,index) in templates">
            <div class="w-48 flex flex-col mb-4 cursor-pointer" v-if="index>=start && index < (start+limit)" @click="setTemplate(template)" :title="template.category">
                <div class="flex flex-row items-center justify-between text-gray-600">
                    <span class="text-xs">{{ template.name }}</span>
                    <i class="material-icons ml-1">{{ template.category === 'page' ? 'web' : 'dynamic_feed'}}</i>
                </div>
                
                <div :style="'background-image:url(' + background(template) + ')'" class="h-48 bg-auto bg-no-repeat bg-cover border shadow rounded"></div>
            </div>
        </template>
    </div>
    <div class="flex flex-row justify-around text-center">
        <i class="material-icons mx-2 text-2xl" @click="prev">chevron_left</i>
        <i class="material-icons mx-2 text-2xl" @click="next">chevron_right</i>
    </div>
</div>
</template>

<script>
export default {
    name: 'BlockGallerySelection',
    data:()=>({
        start: 0,
        limit: 10,
        templates:null,
        filter: 'page'
    }),
    props:['article'],
    computed: {
        loadTemplates(){
            this.$api.service('components').find ( { query : {
                category : this.filter,
                $skip:0,
                $limit:200,
                $sort : { updatedAt : -1 }
            }}).then ( result => {
                this.templates = result.data
            })
            return true
        }
    },
    /*
    watch:{
        filter(v){
            this.templates = this.$mapState().datastore.dataset.components.filter ( templ => {
                return templ.category === v
            })
        }
    },
    */
    methods: {
        background(template){
            let image = ''
            return this.$imageURL ( template.image ) ? this.$imageURL(template.image): require('@/assets/no-image.png')
            template.image && template.image.url ?
                image = template.image.url : 
                    template.image_uri ? image = template.image_uri : ''
            if ( !image.includes('http') ){
                image = process.env.VUE_APP_API_URL + image.substring(1)
            }
            return image
        },
        next(){
            if ( this.start < ( this.templates.length - this.limit ) ){
                this.start += this.limit
            }
        },
        prev(){
            if ( this.start > 0 ){
                this.start -= this.limit
            }
            
        },
        setTemplate(component){
            this.$store.dispatch('setComponent',component)
            this.$emit ( 'component' , component )
        }
    }
}
</script>