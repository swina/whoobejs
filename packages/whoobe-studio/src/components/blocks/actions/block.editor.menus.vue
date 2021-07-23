<template>
    <div v-if="menu" class="w-full z-max bg-gray-400 text-black overflow-y-auto h-4/5 mb-2 shadow">
        <!-- <button @click="tab='items'" class="w-24" :class="tab==='items'?'bg-blue-400':''">Items</button> -->
        <button @click="tab='css'" class="w-24" :class="tab==='css'?'bg-blue-400':''">Customize</button>
        <button @click="tab='responsive'" class="w-24" :class="tab==='responsive'?'bg-blue-400':''">Responsive</button>
        
        <div v-if="tab==='items'" class="p-6 flex flex-row border">
            <div class="w-1/4 border rounded px-2">
                <div class="flex flex-col items-center cursor-pointer p-1 my-1">
                
                    <div class="flex flex-row items-center">
                        <span class="font-bold" @click="showItems=!showItems">Menu Items</span> 
                        <button class="xs ml-2" @click="addItem">Add</button>
                        <i class="material-icons nuxpresso-icon-circle text-xs ml-2 mr-4" @click="addItem">add</i>
                    </div>
                </div>
                <transition name="slideleft">
                    <div class="relative text-gray-800 overflow-y-auto h-full w-full p-1">
                        <draggable v-model="items" class="relative">
                            <div v-for="(item,i) in items" class="flex flex-col text-sm cursor-pointer pb-1" v-if="showItems">
                                <div v-if="currentIndex<0||currentIndex===i" class="bg-gray-600 text-white p-1 flex flex-col" @click="subIndex=-1,currentIndex<0||currentIndex!=i?currentIndex=i:currentIndex=-1,currentFocus=i">{{ item.label }}</div>
                                <transition> 
                                    <div class="relative bg-gray-200 p-1 flex flex-col mb-1" v-if="currentIndex===i">
                                        
                                        <div>
                                            <input class="" type="text" v-model="items[i].label" @focus="currentFocus=i"/>
                                            <a href="#" class="mx-1" @click="setIcon=!setIcon,currentFocus=i">Icon</a>
                                            <i v-if="items[i].hasOwnProperty('icon') && items[i].icon" :class="'text-lg bi-' + items[i].icon" @click="setIcon=!setIcon,currentFocus=i"></i>
                                        </div>
                                        <div style="margin-left:20vw" class="bg-white shadow fixed z-2xtop w-64 h-64 mb-2 border p-1" v-if="currentFocus===i && setIcon">
                                            <moka-edit-icon v-model="items[i].icon" tag="icon_bt" @input="setIcon=!setIcon"  @close="setIcon=!setIcon"/>
                                        </div>
                                        <div v-if="currentFocus===i" class="flex flex-col">
                                            <label>URL</label>
                                            <input class="" type="text" v-model="items[i].link" @focus="currentFocus=i"/>
                                            <label>Page</label>
                                            <div class="flex flex-row items-center">
                                                <select class="w-full" v-model="items[i].link" @focus="currentFocus=i">
                                                    <option v-for="(opt,o) in $datastore('articles')" :value="'/' + opt.slug">{{ opt.title }}</option>
                                                </select>  
                                                <i class="material-icons" @click="refresh()">refresh</i>
                                            </div>
                                        </div>
                                        <a href="#" class="text-xs" @click="items.splice(i,1)">Remove</a><a href="#" class="text-xs" @click="addSubMenu(i)">Add Submenu</a>
                                    </div>
                                    
                                </transition>
                                
                            </div>
                        </draggable>
                        <div class="-mt-4 pl-2 flex flex-col w-full">
                            <div v-if="currentIndex > -1 && items[currentIndex].hasOwnProperty('submenu') && items[currentIndex].submenu.length" class="">
                                <!-- <div class="flex flex-col items-center cursor-pointer p-2">
                            
                                    <div class="flex flex-row items-center text-sm cursor-pointer">
                                        <span class="font-bold" @click="showItems=!showItems">{{items[currentIndex].label}} </span> 
                                        <button v-if="!items[currentIndex].submenu[0].blocks"  class="xs mx-2" @click="addSubMenu(currentIndex)">Add</button>
                                        <div v-if="items[currentIndex].submenu[0].blocks" class="ml-2">(block)</div>
                                    </div>
                                </div> -->
                                <draggable v-model="items[currentIndex].submenu">
                                    <div v-for="(sub,s) in items[currentIndex].submenu">
                                        <div  @click="subIndex<0||subIndex!=s?subIndex=s:subIndex=-1" class=" border p-1 bg-gray-500 text-white mb-1 text-sm cursor-pointer">
                                        {{ sub.label}}
                                        </div>
                                        <transition name="fade">
                                            <div class="mr-1 flex flex-col mb-1" v-if="subIndex===s">
                                                
                                                <input class="" type="text" v-model="items[currentIndex].submenu[s].label" @input="subIndex=-1,subIndex=s"/>
                                                <div class="flex flex-col text-sm">
                                                    <label>URL</label>
                                                    <input class="" type="text" v-model="items[currentIndex].submenu[s].link"/>
                                                    <label>Page</label>
                                                    <div class="flex flex-row items-center">
                                                        <select class="" v-model="items[currentIndex].submenu[s].link">
                                                     
                                                            <option v-for="(opt,o) in $datastore('articles')" :value="'/' + opt.slug">{{ opt.title }}</option>
                                                        </select>
                                                        <i class="material-icons" @click="refresh()">refresh</i>
                                                    </div>
                                                    
                                                    <div class="flex p-1 border rounded">
                                                        <button @click="blocks=!blocks,subIndex=s">Add Block</button>
                                                        <button class="mx-2" @click="pasteFromClipboard()">Paste</button>
                                                        <button v-if="items[currentIndex].submenu[s].blocks" @click="items[currentIndex].submenu[s].blocks=null">Remove Block</button>
                                                    </div>
                                                    <label>Image</label>
                                                    <input type="text" v-model="items[currentIndex].submenu[s].image"/>
                                                    <div class="relative w-24">
                                                        <img v-if="items[currentIndex].submenu[s].hasOwnProperty('image')" class="w-24" :src="$imageURL(items[currentIndex].submenu[s].image)"/><i class="material-icons absolute top-0 right-0 bg-white p-1">delete</i>
                                                    </div>
                                                </div>
                                                <a href="#" class="text-xs" @click="items[currentIndex].submenu.splice(s,1),subIndex=-1,subIndex=s">Remove Item</a>
                                            </div>
                                        </transition>
                                    </div>
                                </draggable>
                            </div>
                        </div>
                    </div>
                </transition>

            </div>
            <!--
            <div class="ml-4 flex flex-col w-1/5">
                <div v-if="currentIndex > -1 && items[currentIndex].hasOwnProperty('submenu') && items[currentIndex].submenu.length" class="border rounded p-1">
                    <div class="flex flex-col items-center cursor-pointer p-2">
                
                    <div class="flex flex-row items-center text-sm cursor-pointer">
                        <span class="font-bold" @click="showItems=!showItems">{{items[currentIndex].label}} </span> 
                        <button v-if="!items[currentIndex].submenu[0].blocks"  class="xs mx-2" @click="addSubMenu(currentIndex)">Add</button>
                        <div v-if="items[currentIndex].submenu[0].blocks" class="ml-2">(block)</div>
                    </div>
                </div>
                    <draggable v-model="items[currentIndex].submenu">
                        <div v-for="(sub,s) in items[currentIndex].submenu">
                            <div  @click="subIndex<0||subIndex!=s?subIndex=s:subIndex=-1" class=" border p-1 bg-gray-500 text-white mb-1 text-sm cursor-pointer">
                            {{ sub.label}}
                            </div>
                            <transition name="fade">
                                <div class="mr-1 flex flex-col mb-1" v-if="subIndex===s">
                                    
                                    <input class="" type="text" v-model="items[currentIndex].submenu[s].label" @input="subIndex=-1,subIndex=s"/>
                                    <div class="flex flex-col text-sm">
                                        <label>URL</label>
                                        <input class="" type="text" v-model="items[currentIndex].submenu[s].link"/>
                                        <label>Page</label>
                                        <div class="flex flex-row items-center">
                                            <select class="" v-model="items[currentIndex].submenu[s].link">
                                                <option v-for="(opt,o) in $datastore('articles')" :value="'/' + opt.slug">{{ opt.title }}</option>
                                            </select>
                                            <i class="material-icons" @click="refresh()">refresh</i>
                                        </div>
                                        
                                        <div class="flex p-1 border rounded">
                                            <button @click="blocks=!blocks,subIndex=s">Add Block</button>
                                            <button class="mx-2" @click="pasteFromClipboard()">Paste</button>
                                            <button v-if="items[currentIndex].submenu[s].blocks" @click="items[currentIndex].submenu[s].blocks=null">Remove Block</button>
                                        </div>
                                        <label>Image</label>
                                        <input type="text" v-model="items[currentIndex].submenu[s].image"/>
                                        <div class="relative w-24">
                                            <img v-if="items[currentIndex].submenu[s].hasOwnProperty('image')" class="w-24" :src="$imageURL(items[currentIndex].submenu[s].image)"/><i class="material-icons absolute top-0 right-0 bg-white p-1">delete</i>
                                        </div>
                                    </div>
                                    <a href="#" class="text-xs" @click="items[currentIndex].submenu.splice(s,1),subIndex=-1,subIndex=s">Remove Item</a>
                                </div>
                            </transition>
                        </div>
                    </draggable>
                </div>
            </div>
            -->
            
            <div class="flex w-full relative p-1 border" v-if="currentIndex > -1 && subIndex > -1 && items[currentIndex].submenu[subIndex].blocks" style="resize:both;overflow:auto;">
                <div> 
                    <block-container :doc="items[currentIndex].submenu[subIndex].blocks" :editor="false"/>
                    <i class="absolute top-0 right-0 z-2xtop cursor-pointer material-icons p-1 bg-gray-100 rounded-full" @click="copyToClipboard(items[currentIndex].submenu[subIndex].blocks)">file_copy</i>
                </div>
            </div>
        </div>
        <div v-if="tab==='css'" class="p-4 bg-gray-400">
                <div class="flex flex-col w-1/3 text-sm">
                    Justify <select v-model="menu.css.align" class="w-full">
                        <option value=""></option>
                        <option value="justify-around">around</option>
                        <option value="justify-between">between</option>
                        <option value="justify-start">start</option>
                        <option value="justify-end">end</option>
                        <option value="justify-center">center</option>
                    </select>
                    
                    <div class="flex flex-col mt-2">
                        Orientation
                        <select v-model="menu.type" class="w-full">
                            <option value="horizontal">Horizontal</option>
                            <option value="vertical">Vertical</option>
                        </select>
                    </div>
                    <div class="flex flex-col mt-2">
                        Menu CSS
                        <textarea class="w-full" v-model="menu.css.css" @focus="currentCSSKey='css',customize=true"/>
                    </div>
                    {{ menu.css.container }}
                    <div class="flex flex-col mt-2">
                        Item CSS
                        <textarea class="w-full" v-model="menu.css.items" @focus="currentCSSKey='items',customize=true"/>
                    </div>
                    <div class="text-sm">
                        Submenu CSS
                        <textarea class=" w-full" v-model="menu.css.submenu" @focus="currentCSSKey='submenu',customize=true"></textarea>
                    </div>
                    <div class="text-sm">
                        Submenu Items CSS
                        <textarea class=" w-full" v-model="menu.css.submenu_items" @focus="currentCSSKey='submenu_items',customize=true"></textarea>
                    </div>
                    <div class="text-sm flex flex-col">
                        <label>
                        Show submenu on mouseover
                        </label>
                        <div>
                            <input type="checkbox" v-model="menu.css.submenu_behavior"> Mouseover
                        </div>
                    </div>
                </div>
                
        </div>
        <div v-if="tab==='responsive'" class="p-4">
            <div class="flex flex-col border rounded p-4">
                <div class="flex flex-row">
                    <input type="checkbox" v-model="menu.responsive"/> Responsive
                    <span class="text-xs ml-2">(Max 1 responsive menu x page)</span>
                </div>
                <div v-if="menu.responsive" class="text-sm flex flex-col">
                    CSS Responsive
                    <textarea class="w-64" v-model="menu.css.responsive" @focus="currentCSSKey='responsive',customize=true"></textarea>
                    Items CSS
                    <textarea class="w-64" v-model="menu.css.responsive_items" @focus="currentCSSKey='responsive_items',customize=true"></textarea>
                </div>
            </div>
        </div>
        
        <!-- <whoobe-menu v-if="tab!='responsive'" class="my-10 border border-dashed" :el="menu"></whoobe-menu>
    
        <transition name="fade">
            <div v-if="tab==='responsive'" class="p-4">
                <div v-if="menu.responsive" class="absolute top-0 right-0 border-8 border-black bg-black w-64 h-3/5 rounded-3xl shadow-2xl pt-2 pb-10 px-2 m-4">
                <div class="bg-white relative" style="height:360px;">
                    <whoobe-menu-responsive :el="menu"></whoobe-menu-responsive>
                </div>
                </div>
            </div>
        </transition> -->

        <transition name="slidedown">
            <modal 
                @close="blocks=!blocks"
                size="md"
                position="modal-top-right"
                v-if="blocks">
                <div slot="title">Blocks Gallery</div>
                <div slot="content">
                    <!-- <whoobe-editor-reusable :emit="true" @block="addBlock"/> -->
                </div>
            </modal>
        </transition>

        <transition name="slideright">
             <modal 
                @close="customize=!customize"
                size="sm"
                buttons="none"
                position="modal-top-right"
                v-if="customize">
                <div slot="title">Customize Menu {{currentCSSKey}}</div>
                <block-tailwind slot="content" mode="menu" :cssKey="currentCSSKey" :css="menu.css[currentCSSKey]" @css="setCSS"/>
             </modal>
        </transition>
    </div>
</template>

<script>
//import MokaEditIcon from '@/components/editor/render/moka.customize.icon'
//import WhoobeMenu from '@/components/editor/preview/elements/moka.menu'
//import WhoobeMenuResponsive from '@/components/editor/preview/elements/moka.menu.responsive'
//import WhoobeEditorReusable from '@/components/moka/editor/components/whoobe.editor.reusable'
//import WhoobeTailwind from '@/components/moka/editor/components/customize/whoobe.tailwind'
//import WhoobeContainer from '@/components/editor/preview/moka.preview.container'
import draggable from 'vuedraggable'
export default {
    name: 'WhoobeMenuEditor',
    //components: { draggable , MokaEditIcon , WhoobeMenu , WhoobeMenuResponsive , WhoobeEditorReusable , WhoobeTailwind , WhoobeContainer },
    components: {
        draggable , 
        'block-customize-icon'   : () => import ( './block.customize.icon.vue' ), 
        'block-tailwind'         : () => import ( '@/components/blocks/editor/tailwind/tailwind.container.vue'),
        'block-container'        : () => import ( '@/components/blocks/editor/components/block.container.vue')
    },
    data:()=>({
        tab: 'items',
        menu: null,
        currentIndex: -1,
        currentFocus: -1,
        subIndex: -1,
        showItems: true,
        setIcon: false,
        items: null,
        menuAlign: '',
        blocks: false,
        customize: false,
        currentCSSKey:'',
        currentCSS:''
    }),
    //props: [ 'menu' ],
    mounted(){
        this.menu = this.$mapState().editor.current
        this.items = this.menu.items
        !this.menu.css.submenu ?
            this.menu.css.submenu = this.menu.css.css + ' w-64 p-4 shadow-xl' : null
        this.menu.responsive ?
            !this.menu.css.responsive ?
                this.menu.css.responsive = 'fixed top-0 left-0 h-screen p-2 z-2xtop' : null: null 
    },
    watch: {
        items(v){
            this.items.hasOwnProperty('submenu') ?
                !this.items.submenu.length ? delete this.items.submenu : null : null
            this.menu.items = this.items
            //this.$emit('menu',this.items)
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
            if ( this.items[i].submenu && this.items[i].submenu.length && this.items[i].submenu[0].blocks ) {
                this.$message ( 'This submenu has a block component. You can\'t add any more items') 
                return
            } 
            this.items[i].submenu.push ( {
                label: 'submenu item #' + parseInt(this.items[i].submenu.length+1),
                link: '#',
                id: this.$randomID()
            })
            this.currentIndex = -1
            this.currentIndex = i
        },
        addBlock(component){
            console.log ( component )
            let obj = JSON.parse(JSON.stringify(component))
            obj.id = this.$randomID()
            obj = this.$clone(obj)
            this.blocks = false
            this.menu.items[this.currentIndex].submenu[this.subIndex].blocks = obj 
        },
        setCSS(css){
            console.log ( 'menu css ' , this.currentCSSKey , ' => ' , this.menu.css[this.currentCSSKey] )
            this.currentCss = css
            //this.currentCSS = css
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
        },
        pasteFromClipboard(){
            let obj = JSON.parse ( window.localStorage.getItem('nuxpresso-clipboard') )
            obj.id = this.$randomID()
            obj = this.$clone(obj)
            console.log ( obj )
            this.menu.items[this.currentIndex].submenu[this.subIndex].blocks = obj
        },
        copyToClipboard(blocks){
            window.localStorage.setItem('nuxpresso-clipboard',JSON.stringify(blocks) )
            console.log ( 'copied' )
            this.$message ( 'Blocks copied' )
        }
    },
}
</script>