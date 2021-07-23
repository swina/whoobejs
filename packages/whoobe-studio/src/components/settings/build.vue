<template>
    <div v-if="articles && menu" class="m-4">
        <div class="grid grid-cols-2">
            <div>
                <template v-for="(page,index) in links">
                    <div class="text-sm flex flex-row my-1">

                        <div class="w-1/4">{{pageSlug(page)}}</div> 
                        <button @click="slug=pageSlug(page),found.push(page)" v-if="!found.includes(page) &&  pageSlug(page) != 'homepage'">Find</button>
                        <i class="material-icons text-green-500" @click="exportSingle(page)" v-if="found.includes(page)">check_circle</i>
                        <i class="material-icons text-green-500" @click="exportSingle(page)" v-if="pageSlug(page)==='homepage'" >check_circle</i>
                        
                    </div>

                </template>
            </div>
            <div class="flex flex-col text-sm items-start">
                <template v-for="block in components">
                    <div class="p-2 m-1 w-full border" @click="exportTemplate(block)">{{ block.name }}</div>
                </template>
            </div>
        </div>
        <button v-if="menu" @click="exportAll=!exportAll">Build</button>
        <div>
            <template v-for="article in exportArticles">
                {{ article.title }}<br/>
            </template>
        </div>
        
        <!-- EXPORT ARTICLES -->
        <transition name="fade">
            <div v-if="exportAll" class="nuxpresso-modal rounded w-full md:w-1/4  p-4 flex flex-col bg-white z-2xtop">
                <i class="material-icons absolute top-0 right-0 cursor-pointer" @click="exportAll=!exportAll">close</i>

                <h4>Export Article</h4>
                <div class="flex flex-col bg-gray-300 p-2 rounded">
                <vue-blob-json-csv
                    file-type="json"
                    :file-name="title"
                    :data="[currentPage]"
                >
                <button class="my-2">Download</button>
                <div class="text-xs">{{ title }}.json</div>
                </vue-blob-json-csv>
                </div>
            </div>
        </transition>
    </div>
</template>

<script> 
import fs from 'fs'
export default {
    name: "MokaBuilder",
    data:()=>({
        title: 'articles',
        menu: [],
        slug: 'homepage',
        found: [],
        exportPages:[],
        exportAll: false,
        currentPage: null
    }),
    computed:{
        links(){
            let pages = this.menu.filter ( m => !m.includes('http') && !m.includes('#') )
            return [...new Set(pages)];
        },
        exportArticles(){
            let arr = [...new Set(this.exportPages)]
            let outputArray = {}
            arr.forEach( page => {
                //let obj = {}
                //obj[page.slug] = page
                outputArray[page.slug] =  page 
            })
            return outputArray
        }
    },
    watch:{
        articles(v){
            if ( v ) this.findMenu(this.articles.blocks.json,'menu')
            this.findMenu(this.articles.blocks.json,'link')
            this.slug = 'homepage'

            /*this.links.forEach ( li => {
                if ( li.replace('/articles/','/') === '/' ){
                    this.slug = '/articles/homepage'
                } else {
                    this.slug = li.replace('/articles/','')
                }
            })
            */
        },
        page(v){
            console.log ( 'Request page => ' , v )
            if ( v ){
                console.log ( 'get page=> ' , v.id , v.title )
                this.$http.get('articles/' + v.id ).then ( response => {
                    let pagina = response.data 
                    console.log ( pagina )
                    this.exportPages.push ( pagina )
                    this.findMenu(pagina.blocks.json,'menu')
                    this.findMenu(pagina.blocks.json,'link')
                })
            }
        }
    },
    methods:{
        pageSlug(page){
            let p = page.replace('/articles/','')
            return p === '/' ? 'homepage' : p
        },
        findMenu(target,element){
            let vm = this
            findNode(target,element)
            function findNode(currentNode,element){
                var node = null
                for(var index in currentNode.blocks){
                    
                    node = currentNode.blocks[index];
                    if ( element === 'menu' && node.element === element) {
                        node.items.forEach(item=>{
                            vm.menu.push ( item.link )
                            if ( item.hasOwnProperty('submenu') ){
                                item.submenu.forEach ( sub => {
                                    vm.menu.push ( sub.link )
                                })
                            }
                        })
                        return node.items
                    } else {
                        if ( node.hasOwnProperty(element) && node[element] ){
                            vm.menu.push ( node[element] )
                            return
                        }
                        findNode( node , element );
                    }
                }
            }
        },
        scanPages(){
            let pages = this.menu.filter ( m => !m.includes('http') && !m.includes('#') )
            pages = [...new Set(pages)]
            pages.forEach ( page => {
                console.log ( page )
                this.slug = page.replace('/articles/','') 
            })
        },
        exportSingle(page){
            let p = this.pageSlug(page)
            this.title = p
            this.currentPage = this.exportArticles[p] 
            this.exportAll = true
        },
        exportTemplate(block){
            this.$http.get('components/' + block.id ).then ( response => {
                this.title = block.name           
                this.currentPage = response.data
                this.exportAll = true
            })
        }
        
    }
}
</script>