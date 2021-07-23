<template>
    <div v-if="articles && cols" class="m-2 p-4">
            <div class="bg-gray-900 sticky top-0 -mt-2 p-2 w-full z-2xtop" v-if="!selected">
                <button class="lg" @click="$action('articles_create')">Create new</button>
                <span class="ml-2">Category</span> 
                <select v-model="filter" class="dark ml-2 w-32">
                    <option value="">all</option>
                    <option v-for="category in $mapState().datastore.dataset.categories.filter(a=>a.type==='article')" :value="category.name">{{ category.name }}</option>
                </select>
                <span class="ml-2">Search</span>
                <input type="text" v-model="search" class="dark ml-2 w-32" @keydown="searchPage($event)"/>
            </div>
        <div class="bg-gray-200 text-sm" v-if="!selected">
            <div class="theme-dark bg-black grid" :class="'grid-cols-' + (cols.length+1)">
                <div class="p-1 capitalize font-bold"  :class="field.title==='title'?'col-span-2':''" v-if="field.title!='_id'" v-for="(field,f) in cols" :key="f">{{ field.title }}</div>
                    
            </div>
            <div class="hover:bg-gray-300 cursor-pointer w-full p-1 flex flex-row border-b" v-for="article in articles">
                <div class="w-full grid" :class="'grid-cols-' + (cols.length+1)">
                    <div v-for="field in cols" v-if="field.title!='_id'" :class="field.title==='title'?'col-span-2':''" @click="loadSingleArticle(article._id)">
                        <span v-if="field.type==='string'" :class="field.title==='title'?'font-bold':''">
                            {{ article[field.title] }}
                        </span>
                        <icon v-if="field.type==='boolean'" :name="article[field.title]?'check':'close'" class="mx-5" :class="article[field.title]?'text-green-400 font-bold':'text-red-600'"/>
                        <img v-if="field.type==='image' && article[field.title]" :src="imageURL(article[field.title])" class="w-24 h-16 object-top object-cover"/>
                        <span v-if="field.type==='date'">
                            {{ article[field.title].split('T')[0] }}
                        </span>
                    </div>
                    <div>
                        <button @click="deleteArticle(article._id)">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!selected" class="w-full theme-dark grid grid-cols-3 p-1">
            <div class="text-xs">
                {{skip+1}}-{{(skip+limit)>total?total:(skip+limit)}} of {{ total }}
            </div>
            <navigation size="4xl" @prev="skip>0?skip=skip-limit:null" @next="total-(skip+limit)>0?skip=skip+limit:null"/>
            <div></div>
        </div>
        <article-edit :article="selected" v-if="selected" @close="selected=null"/>
    </div>
</template>

<script>
export default {
    name: 'Articles',
    components: {
        'article-edit' : () => import ( './article.edit.vue')
    },
    data:()=>({
        cols: [],
        filter:'',
        search:'',
        articles:null,
        skip: 0,
        limit: 10,
        total: 0,
        sortby: { updatedAt: -1 },
        newArticle: null,
        selected: null
    }),
    watch:{
        skip(v){
            this.loadArticles()
        },
        filter(v){
            this.loadArticles()
        },
        
    },
    methods:{
        searchPage(e){
            if ( e && e.target.value.length > 2 ){
                if ( e.keyCode===13 ){
                    this.$api.service ( 'articles' ).find ( {
                        query : {
                            $search : e.target.value
                        }
                    }).then ( res => {
                        this.articles = res.data
                        this.total = res.total
                    })
                }
            } else {
                this.loadArticles() 
            }
        },
        imageURL(image){
            if ( !image ) return ''
            let cms = window.localStorage.getItem('whoobe-cms')
            return image.includes('http') ? image : cms + image.substring(1) 
        },
        loadArticles(){
            let fields = this.cols.map ( col => {
                return col.title 
            })
            console.log ( fields )
            let qry = {
                $limit : this.limit,
                $skip: this.skip,
                $select: fields,
                $sort : this.sortby
            }
            this.filter ?
                qry.categories = this.filter : null
            this.$api.service('articles').find ({
                query : qry
            }).then ( result => {
                this.total = result.total
                this.articles = result.data
            })
        }, 
        loadSingleArticle(id){
            this.$api.service ( 'articles' ).get ( id ).then ( res => {
                this.selected = res
                //this.$mapState().datastore.currentArticle = res
            })
        },
        deleteArticle(id){
            this.$api.service ( 'articles').remove ( id ).then ( res =>{
                this.loadArticles()
            })
        }
    },
    mounted(){
        let schema = this.$mapState().datastore.schema.articles
            let article = {}
            Object.keys(schema).map ( field => {
                let fType = schema[field].type
                fType === 'string' ? article[field] = '' :
                    fType === 'object' ? article[field] = {} :
                        fType === 'null' ? article[field] = null :
                            fType === 'boolean' ? article[field] = false :
                                fType === 'array' ? article[field] = [] : 
                                    fType === 'image' ? article[field] = '' : null
            })
            this.schema = schema
            delete article._id
            delete article.createdAt
            delete article.updatedAt
            this.newArticle = article

        
        Object.keys(schema).map ( field => {
            //console.log ( schema[field] )
            schema[field].list ? this.cols.push ( schema[field] ) : null
        })
        this.loadArticles()
    }
}
</script>