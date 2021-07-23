<template>
    <div class="text-sm w-full relative theme-dark overflow-y-auto z-2xtop mb-2 shadow">
        <div v-if="editor.current" class="w-full z-2xtop">
            
            <!-- <div class="bg-purple-700 text-white flex flex-row items-center p-1 shadow relative p-1">
                <div class="w-full flex flex-row items-center justify-around text-base" @dblclick="$emit('switch')">
                    
                    <div>
                        <span v-if="editor.current.tag!='menu'" class="capitalize">{{ editor.current.type || editor.current.tag }}</span>
                        <span v-else>Menu <span v-if="customizeDropdown">Dropdown</span></span>
                    </div>
                    <i class="material-icons text-sm ml-2">{{editor.current.icon}}</i> 
                    <div class="text-xs lg:text-sm text-gray-500">{{ size }}</div>
                    <div class="text-xs lg:text-sm text-gray-500">{{ position }}</div>
                </div>
                
            </div> -->
            <!-- <whoobe-edit-content 
                :entity="editor.current" 
                :element="editor.current" 
                :component="$attrs.component"
                @media="$emit('media')"/> -->
                
            <block-tailwind 
                v-if="entity && editor.current.tag!='document' && editor.current.tag!='menu' && !editor.current.css.hasOwnProperty('css')" 
                :css="$clean(editor.current.css)" 
                :entity="entity.entity"
                :key="editor.current.id"
                :columns="false"
                @stile="set_style"
                @css="setCSS"/>
            
            <block-tailwind 
                v-if="entity && editor.current.tag!='document' && editor.current.tag !='menu' && editor.current.css.hasOwnProperty('css')" 
                :css="$clean(editor.current.css.css)" 
                :entity="entity.entity"
                :key="editor.current.id"
                :columns="true"
                @stile="set_style"
                @css="setCSS"/>

                <!-- :css="!customizeDropdown?$clean(editor.current.css.css):$clean(editor.current.css.submenu)" 
                :allCss="!customizeDropdown?$clean(editor.current.css.css):$clean(editor.current.css.submenu)" -->
            <block-tailwind 
                v-if="entity && editor.current.tag!='document' && editor.current.tag ==='menu'" 
                :css="$clean($attrs.css)"
                :cssKey="$attrs.cssKey"
                :entity="entity.entity"
                :key="editor.current.id"
                mode="menu"
                :columns="true"
                :submenu="customizeDropdown"
                @stile="set_style"
                @css="setCSS"/>

            <block-tailwind 
                v-if="entity && editor.current.tag==='document'"
                :css="$clean(editor.current.css)"
                :allCss="$clean(editor.current.css)"
                :entity="entity.entity"
                :key="editor.current.id"
                :columns="false"
                @css="setCSS"/>
           
            <transition name="fade">
                <div class="w-full mr-1 bg-white border shadow p-4 z-max" v-if="confirmModal">
                    <h5>Delete this object ?</h5>
                    <button @click="confirm=false,confirmModal=!confirmModal">No</button>
                    <button class="ml-2 danger" @click="confirm=true,confirmModal=!confirmModal,entity_delete()">Yes, delete</button>
                </div>  
            </transition>

        </div>
    </div>
</template>

<script>
// import WhoobeEditContent from '@/components/moka/editor/components/editing/whoobe.editor.editing.content'
// import WhoobeTw from '@/components/moka/editor/components/customize/whoobe.tailwind'
// import fonts from '@/plugins/icons'
import { mapState } from 'vuex'
export default {
    name: 'MokaCustomizer',
    components: {  
        'block-tailwind'    : () => import ( './tailwind.vue' )
        // WhoobeEditContent , 
        // WhoobeTw 
    },
    data:()=>({
        customizeDropdown: false,
        settings: false,
        breakpoint:'md',
        confirmModal: false,
        confirm:false,
        media: false,
        slider_settings: true,
        tailwind: false,
        tailwindID: 0,
        fontFamily:'Barlow Condensed',
        init: false,
        entity: {
            entity: null
        },
        loop: false,
        articleID: null,
        grid_settings:[],
        grid_gaps: [ '' , '1' , '2' , '3' , '4' , '5' , '6' , '8', '10' , '12', '16', '20', '24', '32', '40', '48', '56', '64' ],
        grid_gap:'',
        grid_columns:1,
        entity_copied: null,
        stile: '',
        saveAsReusable: false,
        newReusableComponent: {
            name: 'New reusable component',
            description: 'A new reusable component',
            category: 'component'
        },
        grid_cols:3,
        grid_tot:100,
        col_1 : 50,
        col_2 : 50,
        entities : [ 'Body', 'Block' , 'Container' , 'Element' , 'Block' , 'Container' , 'Element' , 'Element'],

        printScreen: null,
    }),
    props: [ 'id'],
    watch:{
        id(){
            this.tailwindID = this.$randomID()
        },
        loop(v){
            this.$attrs.component.loop = v
            this.$attrs.component.json.loop = v
            this.editor.current.loop = v
        },
        tailwind(v){
            this.tailwindID = this.$randomID()
            !v ? this.$emit('disabled') : null
        }, 
        grid_columns(v){
            if ( v < this.editor.current.blocks.length ){
                this.editor.current.css.container = 'flex flex-col md:grid md:grid-cols-' + v
            }
        },
        stile(v){
            this.editor.current.style = v
        },
        grid_gap(v){
            let container_css = this.editor.current.css.container.split(' ')
            let classes = container_css.map ( (cl,index) => {
                if ( cl.indexOf('gap-') > -1 ){
                    return ''
                } else {
                    return cl
                } 
                
            })
            let gap = v ? ' gap-' + v : ''
            this.editor.current.css.container = this.$clean(classes.join(' ') + gap ) 
        },
        fontFamily(font){
             
            document.querySelector('#content').style.fontFamily = font
            this.$attrs.component.json.blocks[0].block.style = 'font-family:\"' + font + '\"'
        },
        articleID(id){
            this.$http.get('articles/' + id ).then ( response=> {
                this.entity.entity['article'] = response.data
            })
        }
    },
    computed:{
         ...mapState ( ['editor'] ),
        // editor(){
        //     return this.$mapState().editor
        // },
        // component(){
        //     this.entity.entity = this.$attrs.element
        //     //this.entity.entity = this.moka.current 
        //     this.editor.current.tag === 'blocks' ? this.editor.current.type = 'flex' : null
        //     this.editor.current.tag === 'blocks' ? this.editor.current.icon = 'select_all' : null
        //     this.entity.entity ? this.editor.current.hasOwnProperty('cols') ? this.grid_columns = this.editor.current.cols : 0 : null
        //     this.isRichText
        //     !this.editor.current.css.hasOwnProperty('css') ?
        //         this.editor.current.css = this.$clean(this.editor.current.css , 'md:' ) :
        //             this.editor.current.css.css = this.$clean(this.editor.current.css.css , 'md:' ) 
        //     this.editor.current.type === 'video' ?
        //         !this.editor.current.hasOwnProperty('options') ?
        //             this.editor.current.options = {
        //                 autoplay: true,
        //                 loop: true,
        //                 controls: true
        //             } : null : null
        //     this.grid_settings = []
        //     this.stile = this.editor.current.style
        // },
        isRichText(){
            return
            if ( this.entity.entity && this.editor.current.element === 'p'){
                this.editor = true
            }
        },
        size(){
            return this.editor.current.coords ?
                this.editor.current.coords.width.toFixed(2) + ' x ' + this.editor.current.coords.height.toFixed(2) : ''

        },
        position(){
            return this.editor.current.coords ?
                'x:' + this.editor.current.coords.x.toFixed(2) + ' y:' + this.editor.current.coords.y.toFixed(2) : ''
        }
    },
    methods:{
        mobile(bp){
            return bp === this.breakpoint ? 'nuxpresso-icon-circle' : ''
        },
        test(css){
            document.querySelector('#content').style.fontFamily = 'Amethysta'
        },
        setCSS(css){
            !this.editor.current.css.hasOwnProperty('css') ?
                this.editor.current.css = css :
                    this.editor.current.css.css = css
            this.$store.dispatch('current',this.entity.entity)
        },
        setCSSSubmenu(css){
            console.log ('submenu',css )
            this.editor.current.css.submenu = css
            this.$store.dispatch('current',this.entity.entity)
        },
        set_css(css){
            this.editor.current.css = css
        },
        set_style(stile,extra){
            this.editor.current.style = this.$clean(stile)
            if ( extra ){
                this.editor.current.css.container = this.editor.current.css.container + ' ' + extra
            }    
        },
        set_image(img){
            this.editor.current.image = img
        },
        entity_copy(){
            this.entity_copied = Object.assign ( {} , this.entity.entity )
            this.entity_copied.id = this.$randomID()
        },
        entity_duplicate(){
            let master = this.$attrs.component.json.blocks[this.entity.coords[0]]
            let obj = {}
            obj = Object.assign ( {} , this.entity.entity )
            obj.id = this.$randomID()
            let blocks = []
            obj.blocks.forEach ( block => {
                let bb = {}
                bb = Object.assign ( {} , block )
                bb.id = this.$randomID()
                blocks.push ( bb )
            })
            obj.blocks = blocks
            master.blocks.push(obj)
            master.cols++
            master.css.container = 'flex flex-col md:grid md:grid-cols-' + master.blocks.length
            return
        },
        entity_paste(){
            if ( this.entity_copied ){
                
                let obj = Object.assign ( {} , this.entity_copied )
                obj.id = this.$randomID()
                this.editor.current.blocks.push ( obj )
            }
        }, 
        entity_delete(){
            let coords = this.entity.coords

            if ( coords && this.confirm ){
                if ( coords.length === 2 ){
                    console.log ( 'removing container ')
                    let master = this.$attrs.component.json.blocks[coords[0]]
                    master.blocks.splice ( coords[1] , 1)
                    master.cols--
                    master.css.container = 'flex flex-col md:grid md:grid-cols-' + master.blocks.length
                    return 
                } else {
                    this.$emit ( 'delete' )
                    this.confirm = false
                }
            }  
        },
        tag(){
            return this.editor.current.element != 'image' ? 'input' : 
                    false
        },
        saveNewBlock(){
            let comp =  {
                name: this.newReusableComponent.name,
                description: this.newReusableComponent.description,
                image: null,
                image_uri: null,
                category: this.newReusableComponent.category,
                json : {    
                    id: null,
                    css: '',
                    image: null,
                    tag: 'document',
                    blocks: [
                        this.entity.entity
                    ]
                }
            }
            this.saveAsReusable = false
            this.$emit('saveblock',comp)
        }
         
    },
    mounted(){
    }
}
</script>

<style>
.editfields > div > input , .editfields > div > textarea , .editfields > div > select {
    background: black;
}
</style>