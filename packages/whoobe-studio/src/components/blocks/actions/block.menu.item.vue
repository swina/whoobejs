<template>
    <div class="flex flex-col p-2 h-screen">
        <div class="flex flex-row">
            <button class="lg" @click="addItem()">Add sub item</button>
            <button class="lg mx-1" @click="addArticles=!addArticles">Add Articles</button>
            <button class="lg" @click="addBlock()">Add Block</button>
            <button class="lg mx-1" @click="pasteBlock()">Paste Block</button>
            <button class="lg" v-if="editor.current.blocks.length" @click="removeBlock()">Remove Block</button>
        </div>
        <div class="grid grid-cols-3 gap-5 mt-4">
            <div>Label</div>
            <div>Link/URL</div>
            <div>Article</div>
        </div>
        <div class="grid grid-cols-3 gap-5 mt-1">
            <div class=" bg-gray-700 mb-1 pl-1" contenteditable v-html="editor.current.content" @blur="handleInput($event,'root')"/>
            <input type="text" class="w-full theme-dark border" v-model="editor.current.link"/>
            <select class="w-full theme-dark border" v-model="editor.current.link">
                <option value="/"></option>
                <option v-for="article in $mapState().datastore.dataset.articles" :value="'/' + article.slug">{{ article.title }}</option>
            </select>
        </div>
            
        <template v-for="(block,index) in editor.current.blocks" v-if="editor.current.blocks.length && !editor.current.blocks[0].hasOwnProperty('blocks')">
            <div class="grid grid-cols-3 gap-5">
                <div class="flex flex-row items-center">
                    <div class="ml-4 w-full bg-gray-700 mb-1 pl-1" contenteditable v-html="block.content" @blur="handleInput($event,index)"/>
                    <icon name="close" @click="editor.current.blocks.splice ( index , 1)"/>
                </div>
            <input type="text" class="w-full theme-dark border" placeholder="/" v-model="block.link"/>
            <select class="w-full theme-dark border" v-model="block.link">
                <option value="/"></option>
                <option v-for="article in articles" :value="'/' + article.slug">{{ article.title }}</option>
            </select>
            </div>
        </template>

        <div v-if="articles && addArticles" class="flex flex-col p-2 h-1/2 w-11/12 absolute bottom-0">
            Articles
            <div class="relative overflow-y-auto w-full m-auto">
                <template v-for="(article,index) in articles">
                    <div class="flex flex-row justify-start items-center border-b border-gray-900 p-1 cursor-pointer hover:bg-gray-700 text-gray-600" @click="addArticle(article,index)">
                        <icon :name="article.publish?'check':'close'" :class="article.publish?'text-lime-500':'text-red-500'"/> {{ article.title }}
                    </div>
                </template>
            </div>
        </div>
            
        
        <block-container :doc="editor.current.blocks[0]" v-if="editor.current.blocks.length && editor.current.blocks[0].hasOwnProperty('blocks')" :editor="false"/>
        
        <!-- <template v-for="block in editor.current.blocks">
            <block-preview :doc="block"/>
        </template> -->
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: 'BlockMenuItemEditor',
    components:{
        'block-container'   : () => import ( '@/components/blocks/editor/components/block.container.vue')
    },
    data:()=>({
        articles: null,
        addArticles: false,
        subitems: []
    }),
    computed:{
        ...mapState ( ['editor'] ),
       
    },
    methods:{
        handleInput: function(e,i){
            let text = e.target.innerHTML.replaceAll(/style=\".*"/gm,'')
            i === 'root' ?
                this.editor.current.content = text :
                    this.editor.current.blocks[i].content = text
        },
        addItem(){
            let subitem = JSON.parse( JSON.stringify ( this.editor.current ))
            if ( this.editor.current.blocks ){
                this.editor.current.blocks.forEach ( sub => {
                    if ( sub.hasOwnProperty('blocks') ){
                        this.$message ( 'Remove the block for this item to add a standard submenu' )
                        return
                    }
                })
                subitem.id = this.$randomID()
                subitem.content = 'Menu sub item #' + (this.editor.current.blocks.length + 1) 
                delete subitem.blocks
                this.editor.current.blocks.push ( subitem )
            }
        },
        addArticle(article,index){
            let subitem = JSON.parse( JSON.stringify ( this.editor.current ))
            if ( this.editor.current.blocks ){
                this.editor.current.blocks.forEach ( sub => {
                    if ( sub.hasOwnProperty('blocks') ){
                        this.$message ( 'Remove the block for this item to add a standard submenu' )
                        return
                    }
                })
                subitem.id = this.$randomID()
                subitem.content = article.title 
                subitem.link = '/' + article.slug
                delete subitem.blocks
                this.editor.current.blocks.push ( subitem )
                if ( !article.publish ){
                    this.$api.service ( 'articles' ).patch ( article._id , { publish: true } )
                    this.articles[index].publish = true
                }
            }
        },
        addBlock(){
            return
        },
        pasteBlock(){
            let obj = JSON.parse ( window.localStorage.getItem('whoobe-clipboard') )
            obj.id = this.$randomID()
            obj = this.$clone(obj)
            this.editor.current.blocks = []
            this.editor.current.blocks.push ( obj )
        },
        removeBlock(){
            this.editor.current.blocks = []
        }
    },
    mounted(){
        this.$api.service ( 'articles' ).find({
            query : {
                $limit: 200,
                $sort: { title: 1}
            }
        }).then ( res => {
            this.articles = res.data 
        })
    }
}
</script>