<template>
    <div v-if="menu" class="w-full z-max bg-gray-100 text-black overflow-y-auto h-full mb-2 shadow">
        <div class="flex flex-col items-center cursor-pointer p-1 my-1">
           
            <div class="flex flex-row items-center">
                <span class="font-bold" @click="showItems=!showItems">Menu Items</span> 
                <button class="xs ml-2" @click="addItem">Add</button>
                <i class="material-icons nuxpresso-icon-circle text-xs ml-2 mr-4" @click="addItem">add</i>
            </div>
        </div>
        <transition name="fade">
            <div class="absolute bg-gray-200 text-gray-800 overflow-y-auto h-full w-full p-1">
            <draggable v-model="items" class="relative">
                <div v-for="(item,i) in items" class="flex flex-col text-sm cursor-pointer pb-1" v-if="showItems">
                    <div class="bg-gray-600 text-white p-1 flex flex-col" @click="currentIndex<0||currentIndex!=i?currentIndex=i:currentIndex=-1">{{ item.label }}</div>
                    <transition> 
                        <div class="relative bg-gray-200 p-1 flex flex-col mb-1" v-if="currentIndex===i">
                            
                            <div>
                                <input class="" type="text" v-model="items[i].label" @focus="currentFocus=i"/>
                                <a href="#" class="mx-1" @click="setIcon=!setIcon,currentFocus=i">Icon</a>
                                <i v-if="items[i].hasOwnProperty('icon') && items[i].icon" :class="'text-lg bi-' + items[i].icon" @click="setIcon=!setIcon,currentFocus=i"></i>
                            </div>
                            <div style="margin-left:20vw" class="bg-white shadow fixed z-2xtop w-64 h-64 mb-2 border p-1" v-if="currentFocus===i && setIcon">
                                <block-customize-icon v-model="items[i].icon" tag="icon_bt" @input="setIcon=!setIcon"  @close="setIcon=!setIcon"/>
                            </div>
                            <div v-if="currentFocus===i" class="flex flex-col">
                                <label>URL</label>
                                <input class="" type="text" v-model="items[i].link" @focus="currentFocus=i"/>
                                <label>Page</label>
                                <div class="flex flex-row items-center">
                                    <select class="" v-model="items[i].link" @focus="currentFocus=i">
                                        <option v-for="(opt,o) in $datastore('articles')" :value="'/' + opt.slug">{{ opt.title }}</option>
                                    </select>  
                                    <i class="material-icons" @click="refresh()">refresh</i>
                                </div>
                            </div>
                            <a href="#" class="text-xs" @click="items.splice(i,1)">Remove</a><a href="#" class="text-xs" @click="addSubMenu(i)">Add Submenu</a>
                        </div>
                        
                    <draggable v-model="item.submenu">
                        <div v-if="item.submenu && currentIndex===i" v-for="(sub,s) in item.submenu">
                            <div  @click="subIndex<0||subIndex!=s?subIndex=s:subIndex=-1" class="ml-2 border p-1 bg-gray-600 text-white mb-1">
                            {{ sub.label}}
                            </div>
                            <transition name="fade">
                                <div class="ml-3 mr-1 flex flex-col mb-1" v-if="subIndex===s">
                                    
                                    <input class="" type="text" v-model="items[i].submenu[s].label" @input="subIndex=-1,subIndex=s"/>
                                    <div class="flex flex-col">
                                        <label>URL</label>
                                        <input class="" type="text" v-model="items[i].submenu[s].link"/>
                                        <label>Page</label>
                                        <div class="flex flex-row items-center">
                                            <select class="" v-model="items[i].submenu[s].link">
                                                <!--<option v-for="(opt,o) in $datastore('setup')[0].categories.articles" :value="'/articles/category/' + opt.slug">category/{{ opt.name}}</option>-->
                                                <option v-for="(opt,o) in $datastore('articles')" :value="'/' + opt.slug">{{ opt.title }}</option>
                                            </select>
                                            <i class="material-icons" @click="refresh()">refresh</i>
                                        </div>
                                        
                                    </div>
                                    <a href="#" class="text-xs" @click="items[currentIndex].submenu.splice(s,1),subIndex=-1,subIndex=s">Remove</a>
                                </div>
                            </transition>
                        </div>
                    </draggable>
                    </transition>
                    
                    <!-- <draggable v-model="item.submenu">
                        <div v-if="item.submenu && currentIndex===i" v-for="(sub,s) in item.submenu">
                            <div  @click="subIndex<0||subIndex!=s?subIndex=s:subIndex=-1" class="ml-2 border p-1 bg-gray-600 text-white mb-1">
                            {{ sub.label}}
                            </div>
                            <transition name="fade">
                                <div class="ml-3 mr-1 flex flex-col mb-1" v-if="subIndex===s">
                                    
                                    <input class="" type="text" v-model="items[i].submenu[s].label" @input="subIndex=-1,subIndex=s"/>
                                    <div class="flex flex-col">
                                        <label>URL</label>
                                        <input class="" type="text" v-model="items[i].submenu[s].link"/>
                                        <label>Page</label>
                                        <div class="flex flex-row items-center">
                                            <select class="" v-model="items[i].submenu[s].link">
                                                <option v-for="(opt,o) in $datastore('articles')" :value="'/' + opt.slug">{{ opt.title }}</option>
                                            </select>
                                            <i class="material-icons" @click="refresh()">refresh</i>
                                        </div>
                                        
                                    </div>
                                    <a href="#" class="text-xs" @click="items[currentIndex].submenu.splice(s,1),subIndex=-1,subIndex=s">Remove</a>
                                </div>
                            </transition>
                        </div>
                    </draggable> -->
                </div>
            </draggable>
                <div class="flex flex-col">
                    
                    <div class="text-sm">
                        Submenu CSS
                        <textarea class=" w-full" v-model="menu.css.submenu"></textarea>
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="flex flex-row">
                        <input type="checkbox" v-model="menu.responsive"/> Responsive
                    </div>
                    <div  v-if="menu.responsive" class="text-sm">
                        CSS Responsive
                        <textarea class=" w-full" v-model="menu.css.responsive"></textarea>
                    </div>
                    <span class="text-xs">Max 1 responsive menu x page</span>
                </div>
                <div class="flex flex-col mt-2">
                    Orientation
                    <select v-model="menu.type" class="">
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                    </select>
                </div>
                <div class="flex flex-col mt-2">
                    Position
                    <select v-model="menu.css.align" class="">
                        <option value="justify-start">left</option>
                        <option value="justify-center">center</option>
                        <option value="justify-end">right</option>
                    </select>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'

export default {
    name: 'BlockMenuEditor',
    components: { 
        draggable , 
        'block-customize-icon'   : () => import ( './block.customize.icon.vue' ) 
    },
    data:()=>({
        currentIndex: -1,
        currentFocus: -1,
        subIndex: -1,
        showItems: true,
        setIcon: false,
        items: [],
        menuAlign: ''
    }),
    props: [ 'menu' ],
    computed:{
        ...mapState ( ['moka'] ),
        
    },
    mounted(){
        this.menu = 
        !this.menu || !this.menu.items ?
            this.addItem() : this.items = this.menu.items
        !this.menu.css.submenu ?
            this.menu.css.submenu = this.menu.css.css + ' w-64 p-4 shadow-xl' : null
        this.menu.responsive ?
            !this.menu.css.responsive ?
                this.menu.css.responsive = 'fixed top-0 left-0 h-screen p-2 z-2xtop' : null: null 
    },
    watch: {
        items(v){
            this.$emit('menu',this.items)
        }
    },
    methods:{
        addItem(){
            this.items.push ( {
                label: 'new item',
                link: '#',
                title: '',
                id: this.$randomID()
            })
        },
        addSubMenu(i){
            !this.items[i].submenu ? this.items[i].submenu = [] : null
            this.items[i].submenu.push ( {
                label: 'submenu item #' + parseInt(this.items[i].submenu.length+1),
                link: '#',
                id: this.$randomID()
            })
            this.currentIndex = -1
            this.currentIndex = i
        },
        setAlign(){
            
        },
        refresh(){
            this.$api.service('articles').find ( 
            { 
                query : 
                {
                $select : ['_id', 'title' , 'slug' ] 
                }
            }
            ).then ( result => {
            this.$store.dispatch ( 'dataset' , { table: 'articles' , data: result.data })
            })
        }
    },
}
</script>