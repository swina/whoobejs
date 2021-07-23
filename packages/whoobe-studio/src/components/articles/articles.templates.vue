<template>
<div class="flex flex-col theme-dark">
    <div class="flex flex-row my-1 p-1 items-center">
        <span>Category</span> 
        <select v-model="filter" class="ml-2 w-full dark capitalize">
        <option v-for="category in $mapState().datastore.components_categories" :value="category.filter">{{ category.label }}</option>
    </select>
    </div>
    <div v-if="loadTemplates" class="flex flex-row flex-wrap justify-around p-4">
        <template v-for="(template,index) in templates">
            <div class="w-48 flex flex-col mb-4 cursor-pointer" v-if="index>=start && index < (start+limit)" @click="setTemplate(template)" :title="template.category">
                <div class="flex flex-row items-center justify-between text-gray-600">
                    <span class="text-xs">{{ template.name.substring(0,25) }}</span>
                    <i class="material-icons ml-1">{{ template.category === 'page' ? 'web' : 'dynamic_feed'}}</i>
                </div>
                
                <div :style="'background-image:url(' + background(template) + ')'" class="h-48  bg-auto bg-no-repeat bg-cover border shadow rounded"></div>
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
    name: 'ArticleBlockSelection',
    data:()=>({
        start: 0,
        limit: 8,
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
                $sort: { updatedAt: -1}
            }}).then ( result => {
                this.templates = result.data
            })
            return true
        }
    },
    
    watch:{
        filter(v){
            this.start = 0
        }
    },
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
        setTemplate(template){
            this.$api.service ( 'components' ).get ( template._id ).then ( result => {
                console.log ( result )
                delete result.autosave
                this.article.blocks = result
                this.article.component = result._id
                this.article.template_id = result._id 
                this.article.template_preview = result.image 
                this.$api.service ( 'articles' ).find ( ).then ( res => {
                    let count = 0
                    res.data.forEach ( (arts,i) => {
                        if ( arts.template_id === result._id ){
                            arts.template_preview = result.image
                            arts.blocks = result
                            console.log ( arts )
                            this.$api.service ( 'articles' ).patch ( arts._id , arts ).then ( res => {
                                console.log ( 'updated template for ' , res )
                            })
                            count++
                        }
                    })
                    this.$message ( 'Updated ' + count + ' articles' )
                    this.$emit('close')
                })
                
                // this.$mapState().datastore.dataset.articles.map ( arts => {
                //     if ( arts._id === this.article._id ){
                //         arts.template_id = this.article.template_id
                //         arts.template_preview = result.image
                //     }
                // })
                //this.$action()
            })
            
            //this.$mapState().datastore.currentArticle.template_id = template._id
            //this.$mapState().datastore.currentArticle.blocks = template
        }
    }
}
</script>