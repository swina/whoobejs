<template>
<div class="z-2xtop h-screen" v-if="schema">

        <div class="w-full cursor-pointer pb-20 shadow overflow-y-auto bg-gray-800 text-gray-500">
           
            <template v-if="!$attrs.importReusable"  v-for="(group,g) in Object.keys(schema)">
                
                <div class="p-1 border-b border-gray-700 capitalize hover:bg-gray-600" v-if="!$attrs.newblock||group==='containers'" :key="group" @click="currentGroup=group">
                    {{ group }}
                </div>
                <div v-if="currentGroup===group" class="w-full border-b border-gray-700 bg-gray-700 flex flex-row flex-wrap p-1 justify-center" :key="group + '_' + g">
                    <div v-for="(component,c) in schema[group]" class="flex flex-col p-1" :key="'component_' + c">
                        <div class="hover:bg-indigo-700 hover:text-indigo-200 hover:text-black flex-auto flex flex-col justify-center  p-1 text-center text-xs w-16 h-16 cursor-pointer shadow bg-gray-800"  v-if="!$attrs.newblock||component.tag==='container'" @click="setComponent(group,component,schema[group],c)">
                            <span v-if="group==='products'">{{ schema[group] }}</span>
                            <icon class="material-icons text-indigo-300" :name="component.icon"/>
                            <div class="leading-4">{{ component.label }}</div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- <div>
                <template v-for="plugin in $mapState().datastore.dataset.plugins">
                    <div :key="plugin.general.name" class="p-1 border-b border-gray-700 capitalize hover:bg-gray-600" v-if="plugin.component.config.hasOwnProperty('schema') && plugin.component.config.schema" @click="pluginElement(plugin)">
                        {{ plugin.general.name }} [plugin]
                    </div>
                </template>
                
            </div> -->
            <transition name="fade">
                <div class="nuxpresso-modal text-xs p-4 z-50 w-1/3 border relative" v-if="columns" @click="columns=!columns">
                    
                    <h3>Columns</h3>
                    Number of columns<br/>
                    <input type="number" min="1" max="5" v-model="cols"/> <button @click="createColumns">OK</button>
                </div>
            </transition>
            <transition name="fade">
                
                <div class="nuxpresso-modal text-xs p-4 z-50 w-1/3 border" v-if="grids">
                    <i class="material-icons absolute right-0 top-0" @click="grids=!grids">close</i>
                    <moka-grids @grid="addGrid" :element="selected" :loop="isloop"/>
                    
                </div>
            </transition>
            
        <transition name="fade">
            <!-- <div class="nuxpresso-modal w-1/3 text-xs p-4 z-50 border max-h-64 overflow-y-auto" v-if="headings"> -->
            <modal
                v-if="headings"
                buttons="none"
                @close="headings=!headings">
                <div slot="title">
                Select Heading
                </div>
                <div slot="content" class="p-2">
                Heading level <select v-model="selected.level" class="mr-2">
                    <option v-for="n in 6" :value="n">H{{n}}</option>
                </select>
                <button class="sm w-12" @click="addElement(selected),headings=!headings">OK</button>
                </div>
            </modal>
            <!-- </div> -->
        </transition>

        <transition name="fade">
            <div class="nuxpresso-modal w-1/3 text-xs p-4 z-50 border max-h-64 overflow-y-auto" v-if="svgSelect">
                Select SVG
                <select v-model="selected.content" class="mr-2">
                    <option v-for="wave in svgs" :value="wave.src">{{wave.label}}</option>
                </select>
                <button class="sm w-12" @click="$emit('add',selected)">OK</button>
            </div>
        </transition>
       
        <!-- <transition name="fade">
            <div class="nuxpresso-modal w-1/4 text-xs p-4 z-50 border max-h-64 overflow-y-auto" v-if="icons">
                Icon Category
                <select v-model="groupicon">
                    <option v-for="(group,i) in Object.keys(moka.icons)" :value="group">{{ group }}</option>
                </select> 
                <div class="flex flex-row flex-wrap overflow-y-auto" style="height:30rem;min-height:30rem;max-height:30rem" v-if="groupicon">
                    <i v-for="(icon,n) in moka.icons[groupicon]" class="flex flex-row flex-wrap material-icons cursor-pointer m-2" @click="createIcon(icon)">{{ icon }}</i>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="nuxpresso-modal w-1/4 text-xs p-4 z-50 border h-1/2 overflow-y-auto" v-if="bootstrap_icons">
                <i class="material-icons absolute top-0 right-0 m-1" @click="bootstrap_icons=!bootstrap_icons">close</i>
                Icon Search
                <input type="text" v-model="bt_icon_search"/>
                <div class="absolute flex mt-6 max-h-64 h-64 flex-row flex-wrap overflow-y-auto" style="" v-if="bt_icons">
                    <template v-for="icon in bt_icons_found">
                        <i :class="'bi-' + icon + ' text-2xl m-1'" :title="icon" @click="createBTIcon(icon)"></i>
                        
                    </template>
                </div>
            </div>
        </transition> -->
        <transition name="fade">
            <modal 
                v-if="icons"
                size="md"
                position="modal"
                @close="icons=!icons">
                <div slot="title">Icons</div>
                <div slot="content">
                    <block-icons @icon="createIcon"/>
                </div>
            </modal>
        </transition>
        <transition name="fade">
            <modal 
                size="lg"

                v-if="isCollectionField && collectionName"
                @close="isCollectionField=!isCollectionField"
                @click_0="isCollectionField=!isCollectionField"
                @click_1="addProductElement">
                <div slot="title">Add a {{collectionName}} field</div>
                
                <div slot="content">
                    Element 
                    <div class="flex flex-row flex-wrap justify-around">
                        <template v-for="element in schema.text">
                            <div class="flex flex-col m-4 h-16 w-16 hover:bg-gray-300 items-center justify-center" @click="current=Object.assign({},element)">
                                <i class="material-icons">{{ element.icon }}</i>
                                <label class="text-xs">{{ element.label }}</label>
                            </div>
                        </template>
                    </div>
                    <div class="flex flex-row flex-wrap justify-around">
                        <template v-for="element in schema.media">
                            <div class="flex flex-col m-4 h-16 w-16 items-center hover:bg-gray-300 justify-center" @click="current = current=Object.assign({},element)">
                                <i class="material-icons">{{ element.icon }}</i>
                                <label class="text-xs">{{ element.label }}</label>
                            </div>
                        </template>
                    </div>
                    Select a field 
                    <select v-model="selectedField.field">
                        <option v-for="field in Object.keys(collection)" :value="field">{{field}}</option>
                    </select>
                    <div>
                    
                    <pre class="h-48 overflow-y-auto">{{ current }}</pre>
                    </div>
                </div>
                <div slot="footer" v-if="selectedField.element && selectedField.field">
                    {{ collectionName}} field : <span class="font-bold">{{ selectedField.field }}</span>
                    <div class="flex flex-row items-center">
                       Element <i class="material-icons mr-2" v-if="current.icon">{{ current.icon }}</i> {{ current.label }}
                       <button @click="addCollectionField()">Add</button>
                    </div>
                </div>
                    
                
            </modal>
        </transition>
        
    </div>
        <transition name="fade">
            <modal
                size="md"
                position="modal"
                v-if="mansory.display"
                @close="mansory.display=!mansory.display"
                @click_0="mansory.display=!mansory.display"
                @click_1="createMansory()"
                >
                <div slot="title">Mansory</div>
                <div slot="content" class="flex flex-col p-2">
                    <label>Columns</label>
                    <input type="number" class="dark" min="2" max="8" v-model="mansory.cols">
                    <label>Rows</label>
                    <input type="number" class="dark" min="1" v-model="mansory.rows">
                    <label>Columns Gap</label>
                    <input type="number" class="dark" min="0" v-model="mansory.gap">
                </div>
            </modal>
        </transition>
        <!-- media -->
        <transition name="fade" v-if="media">
            <moka-media v-if="media" @close="media=!media" @newimage="setImage"/> 
        </transition>
        
    </div>
</template>


<script>
import MokaGrids from '@/components/blocks/actions/block.grids'
import BlockIcons from '@/components/blocks/actions/block.customize.icon'
//import waves from '@/plugins/svg' 
import booticons from '@/scripts/bootstrap.icons'
//import icons from '@/scripts/icons'
import { mapState } from 'vuex'
export default {
    name: 'WhoobeBlocksElements',
    components: {
        MokaGrids
    },
    data:()=>({
        keys: [],
        currentGroup: '',
        media: false,
        columns: false,
        headings:false,
        heading_level: '1',
        icons: false,
        groupicon: '',
        bootstrap_icons:false,
        bt_icons: null,
        bt_icon_search:'',
        bt_icons_found:null,
        cols: 2,
        grids: false,
        grid: {
            rows: 1,
            cols: 2
        },
        selected: null,
        svgSelect: false,
        components:null,
        isloop: false,
        collection:null,
        collectionName: '',
        isCollectionField: false,
        collectionFields:[],
        current: null,
        selectedField: {
            field: '',
            element: {
                label:'',
                icon: ''
            }
        },
        mansory : {
            display: false,
            cols: 2,
            rows: 2,
            gap: 0
        }
    }),
    mounted(){
        this.bt_icons = booticons
    },
    computed:{
        ...mapState(['moka','datastore']), 
        setcomponents(){
            console.clear()
            return true
        },
        schema(){
            return this.datastore.dataset.elements[0].elements
        },
        svgs(){
            return waves
        }
    },
    watch:{
        bt_icon_search(v){
            if ( v ){
                this.bt_icons_found = this.bt_icons.filter ( icon => icon.includes(v) )
            }
        }
    },
    methods:{
        addElement(element){
            element.id = this.$randomID()
            this.$mapState().editor.current.blocks.push ( element )
            this.$action()
        },
     
        addGrid(obj){
            this.grids = false
            this.$emit('grid',obj)
        },

        setCollectionFields(collection){
            this.getCollectionFields ( collection ) 
            this.isCollectionField = true
            this.collectionName = collection 
        },
        setComponent ( group , component  ){
            let obj = JSON.parse(JSON.stringify(component) )
            obj.id = this.$randomID()
            this.selected = obj
            /*if ( obj.hasOwnProperty('collection') ){
                this.selectedField = { element : { label: '' , field: '' } , field: '' }
                this.getCollectionFields ( obj.collection) 
                this.isCollectionField = true
                return
            }*/
            console.log ( obj )
            if ( obj.element === 'flex-row' || obj.element === 'grid' ){
                component.label === 'Articles Grid' || component.hasOwnProperty('collection') ? this.isloop = true : this.isloop = false
                //this.grids = true
                this.$action('grids')
                return
            } 
            
            if ( obj.type === 'mansory' ){
                this.mansory.display = true
                return
            }

            if ( obj.type === 'icon' ) {
                //this.icons = true
                //this.$mapState().editor.element = obj
                this.$mapState().editor.current.blocks.push ( obj )
                this.$mapState().editor.current = obj
                this.$action('block_icon')
                return
            }
            if ( obj.type === 'icon_bootstrap' ) {
                this.$mapState().editor.current.blocks.push ( obj )
                this.$mapState().editor.current = obj
                this.$action('block_icon')
                return
            }
            if ( obj.element === 'h' ) {
                this.selected = obj
                this.selected.id = this.$randomID()
                this.selected.content = 'Heading'
                this.$mapState().editor.element = this.selected
                this.$action('heading_selector')
                //this.headings = true
                return
            }
            if ( obj.type === 'menu' ){
                let textObj = this.schema.text.filter ( el => {
                    return el.element === 'span'
                })[0]
                console.log ( textObj )
                textObj.content = 'Menu Item'
                textObj.id = this.$randomID()
                textObj.blocks = []
                textObj.icon = 'menu_open'
                textObj.label = 'menu_item'
                obj.blocks.push ( textObj )
                this.$mapState().editor.current.blocks.push ( obj )
                this.$action()
                return
            }
            if ( obj.tag === 'svg' ){
                this.svgSelect = true
                return
            }

            if ( obj.type === 'image' ){
                obj.image = null
            }
            if ( obj.type === 'slides' ){
                let container = {}
                container.label = 'slides'
                //container.blocks[0].blocks.splice(0,1)
                container.blocks = []
                container.type = 'slides'
                container.icon = 'collections'
                container.controls = Object.assign ( {} , obj.slide )
                // container.blocks[0].blocks.push ( obj )
                // container.counter = 0
                this.$mapState().editor.current.blocks.push ( container )
                this.$action()
                return 
            }
            
            //component['id'] = this.$randomID()
            if ( !obj.css.hasOwnProperty('css') ){
                obj.css = ''
            }
            if ( obj.hasOwnProperty('popup') ){
                obj.blocks.push( this.schema.text[2] )
                obj.blocks[0].content = 'Modal/Popup'
            }
            if ( obj ){
                obj.content = component.content //'Add your content here'
                let reusable = this.$clone ( obj )
                this.selected = reusable
                console.log ( 'element => ' , reusable )
                this.$mapState().editor.current.blocks.push ( reusable )
                this.$action()
                //this.$emit( 'add' , reusable )
            }
            //}
        },
        
        createGridNew ( ){
            let obj = JSON.parse(JSON.stringify(this.selected))
            //let obj = Object.assign ( {} , this.selected )
            console.log ( 'from reusables => ' , obj )
            obj['blocks'] = []
            obj.id = this.$randomID()
            obj.css.container = "flex flex-col md:grid md:grid-cols-" + this.grid.cols
            obj.css.css = ''
            let content 
            for ( var n = 0 ; n < this.grid.cols ; n++ ){
                content = JSON.parse(JSON.stringify(this.schema.text[2]))
                content.id = this.$randomID()
                let el = {
                    id: this.$randomID(),
                    blocks: [ content ],
                    image: null,
                    css: {
                        css: 'flex-col',
                        container: 'flex'
                    },
                    style: '',
                    type:'flex',
                    tag:'blocks'
                }
                obj.blocks[n] = el
            }
            this.$emit ( 'add' , obj )
        },
        createMansory(){
            let obj = JSON.parse(JSON.stringify(this.selected))
            obj.blocks = []
            obj.id = this.$randomID()
            obj.style = 'column-count:' + this.mansory.cols + ';' 
            this.mansory.gap ? 
                obj.style += 'columns-gap:' + this.mansory.gap + 'px;' : null
            for ( var n = 0 ; n < (this.mansory.rows*this.mansory.cols) ; n++ ){
                let column = JSON.parse(JSON.stringify(this.schema.containers[0]))
                column.id = this.$randomID()
                let flex = JSON.parse(JSON.stringify(this.schema.containers[1]))
                flex.id = this.$randomID()
                column.blocks.push ( flex )
                column.css.container = 'grid grid-cols-1'
                column.style = 'break-inside:avoid;'
                obj.blocks.push ( column )
            }
            this.$mapState().editor.current.blocks.push ( obj )
        },
        getCollectionFields(collection){
            console.log ( collection )
            this.$http.get ( 'content-type-builder/content-types' ).then ( res => {
                const uid = res.data.data.filter ( ct => {
                    return ct.schema.name === collection
                })
                return uid[0].uid
            }).then ( uid => {
                this.$http.get ( 'content-type-builder/content-types/' + uid ).then ( res => {
                    this.collection = res.data.data.schema.attributes 
                    this.isCollectionField = true
                    this.collectionName = collection
                })
            })
        },
        addCollectionField(){
            
            this.current.label = this.selectedField.field
            this.current.content = this.collectionName + '-' + this.selectedField.field
            delete this.current.parent 
            this.current.id = this.$randomID()
            console.log ( this.current )
            this.collectionFields.push ( this.current )
            this.current = null
            this.selectedField.field = ''
            this.$message ('Field added')
        },
        addProductElement(){
            this.collectionFields.forEach ( element => {
                this.$emit( 'add' , element )
            })
            
        },
        pluginElement ( plugin ){
            this.$mapState().editor.schema = plugin.component.config.schema
            let ln = plugin.general.path.split('/')
            let pippo = ln.pop()
            console.log ( pippo )
            if ( plugin.component.config.source ){
                this.$mapState().editor.source = plugin.component.config.source
            }
            this.$action('block_plugin_schema')
        }

    },
}
</script>