<template>
    <div 
        editor-container 
        v-if="doc"
        :level="$attrs.level" 
        :id="doc.id"  
        class="p-2 fill-current"
        :class="classe(doc.css)" :style="doc.style + ' ' +  background(doc)" @dblclick="doc.blocks.length===0?$action('block_add_element'):null" :title="doc.type" :data-container-tag="doc.tag!='form'?doc.type:doc.tag">
        <div v-if="doc.blocks && !doc.blocks.length && !doc.image" class="text-xs">Dblclick here to add an element</div>
        <div videobg v-if="doc.image && (doc.image.ext==='.mp4' || doc.image.ext==='webm' || doc.image.url.indexOf('.mp4') > -1)" :class="'absolute inset-0 ' ">  
            <video playsinline :poster="doc.image.previewUrl" class="object-cover object-center h-full w-full" autoplay loop>
                <source :src="doc.image.url"/>
            </video>
        </div>
        <template v-for="(block,b) in doc.blocks">
             
            <block-element 
                v-if="block  && (!block.hasOwnProperty('blocks') || block.label === 'menu_item') || ( block.hasOwnProperty('items') && !doc.hasOwnProperty('slider') && !block.hasOwnProperty('blocks_flip') && block.type != 'slides')" 
                :key="b"
                :id="$randomID()"
                :element="block"
                :develop="true"
                :level="parseInt($attrs.level)+1"
                @selected="setCurrent(block),$store.dispatch('setCurrent',block),$store.dispatch('selected',block.id)"
                @customize="customize"
                :parent="[doc.blocks,b]"
                @copy="$emit('copy')"
                @animation="$emit('animations')"
                @delete="$emit('delete')" 
                @editinline="setCurrent(block),edit"/>

            
            <!-- <block-container
                :key="block.id"
                :component="$attrs.component"
                :top="false"
                :root="$attrs.root||false"
                :coords="coords"
                :index="b"
                :level="parseInt($attrs.level)+1" 
                :zi="$attrs.zi + parseInt($attrs.level)"
                v-if="block && block.type==='menu'" 
                :doc="block"
                @copy="$emit('copy')"/> -->
            <!-- <whoobe-element
                v-if="block && !block.hasOwnProperty('blocks') || ( block.hasOwnProperty('items') && !doc.hasOwnProperty('slider') && !block.hasOwnProperty('blocks_flip') && !block.hasOwnProperty('plugin') )"
                :component="$attrs.component"
                :key="block.id"
                :element="block" 
                :coords="[b]"
                :develop="true"
                :level="parseInt($attrs.level)+1" 
                @selected="setCurrent(block),$store.dispatch('setCurrent',block),$store.dispatch('selected',block.id)"
                @customize="customize"
                :parent="[doc.blocks,b]"
                @copy="$emit('copy')"
                @animation="$emit('animations')"
                @delete="$emit('delete')" 
                @editinline="setCurrent(block),edit"/>  -->
            
            <block-container
                :key="block.id"
                :component="$attrs.component"
                :top="false"
                :root="$attrs.root||false"
                :coords="coords"
                :slide="$attrs.slide"
                :flipbox="doc.hasOwnProperty('blocks_flip')? true : false" 
                :index="b"
                :level="parseInt($attrs.level)+1" 
                :zi="$attrs.zi + parseInt($attrs.level)"
                v-if="block && block.hasOwnProperty('blocks') && block.type != 'element' && !block.hasOwnProperty('blocks_flip') && !block.hasOwnProperty('slider') && block.type != 'slides'" 
                :doc="block"
                @copy="$emit('copy')"/>

            <block-editor-slides
                :key="block.id"
                :component="$attrs.component"
                :top="false"
                :root="$attrs.root||false"
                :coords="coords"
                :slide="$attrs.slide"
                :flipbox="doc.hasOwnProperty('blocks_flip')? true : false" 
                :index="b"
                :level="parseInt($attrs.level)+1" 
                :zi="$attrs.zi + parseInt($attrs.level)"
                v-if="block && block.hasOwnProperty('slider') && block.type != 'slides'" 
                :doc="block"
                @copy="$emit('copy')"/> 

            <block-flipcard
                v-if="block.hasOwnProperty('blocks_flip')"
                :key="block.id"
                :doc="block"
                :component="$attrs.component"
                :top="false"
                :root="$attrs.root||false"
                :coords="coords"
                :slide="$attrs.slide" 
                :index="b"
                :level="parseInt($attrs.level)+1" 
                :zi="$attrs.zi + parseInt($attrs.level)"/> 
            
            <block-slides
                v-if="block.type==='slides'"
                :key="block.id"
                :doc="block"
                :component="$attrs.component"
                :top="false"
                :root="$attrs.root||false"
                :coords="coords"
                :slide="$attrs.slide" 
                :index="b"
                :level="parseInt($attrs.level)+1" 
                :zi="$attrs.zi + parseInt($attrs.level)"/>

            <!-- <plugins-wrapper
                class="border-4"
                v-if="block.type === 'plugin'"
                :key="block.id"
                :component="$attrs.component"
                :top="false"
                :root="$attrs.root||false"
                :coords="coords"
                :slide="$attrs.slide"
                :index="b"
                :level="parseInt($attrs.level)+1" 
                :zi="$attrs.zi + parseInt($attrs.level)"
                :plugin="block.plugin"
                :doc="block"
                :editor="true"/> -->


        </template>
        <block-selector 
            :doc="doc"
            :root="root"
            :component="$attrs.component"
            :zindex="zindex"/>
        
        <block-floating
            class="z-highest" 
            v-if="doc.id===editor.selected" 
            :doc="doc" 
            @moveup="moveUp(doc.id,1)"
            @movedown="moveUp(doc.id,-1)"/> 
    </div>

</template>

<script>
//import MokaElement from '@/components/editor/render/moka.editor.element'
//import WhoobeElement from './whoobe.editor.element'
//import MokaSlider from '@/components/editor/preview/moka.slider'
//import MokaEditorSlides from '@/components/editor/render/moka.editor.slides'
//import MokaEditorFlipbox from '@/components/editor/render/moka.editor.flipbox'
//import MokaSlidesContainer from '@/components/editor/render/moka.editor.slides'
//import WhoobeFloatingBar from '@/components/moka/editor/components/whoobe.editor.floating.bar'
//import MokaPluginsWrapper from '@/components/Plugins.Wrapper'
import { mapState } from 'vuex'
import jp from 'jsonpath'

export default {
    name: 'BlockContainer',
    //MokaEditorSlides ,
    //components: { WhoobeElement , MokaElement , MokaSlider ,  MokaEditorFlipbox , MokaSlidesContainer , WhoobeFloatingBar , MokaPluginsWrapper },
    components: {
        'block-element'     : () => import ( './block.element.vue' ),
        'block-floating'    : () => import ( './block.floating.bar.vue' ),
        'block-selector'    : () => import ( './block.container.selector.vue' ),
        'block-flipcard'    : () => import ( './block.flipcard.vue'),
        'block-slides'      : () => import ( '@/components/plugins/slides/slides.editor.vue'),
        'plugins-wrapper'   : () => import ( '@/components/common/plugin.wrapper.vue'),
        'block-editor-slides' : () => import ( './moka.editor.slides.vue' )
    }, 
    props: [ 'doc' , 'coords' ,'pos' ],
    data:()=>({
        index: 0,
        position: null,
        view3D: false,
        showContextMenu: false
    }),
    computed:{
        ...mapState(['desktop','editor']),
        zindex(){
            return this.$attrs.level < 1 ? 'auto' : this.$attrs.level < 2 ? 1 : 
                this.$attrs.level //    this.$attrs.zi
        },
        root(){
            return this.$attrs.top ? 0 : parseInt(this.$attrs.level)
        },
        
        
    },
    methods:{
        moveUp(id,up){
            console.log ( id , up )
            var parent = jp.parent ( this.$attrs.component , '$..blocks[?(@.id=="' + this.doc.id + '")]' )
            console.log ( parent )
            if ( parent.length === 1 ) return
            let i
            parent.forEach ( (p,index) => {
                if ( p.id === this.doc.id ){
                    i = index
                }
            })
            console.log ( i )
            //if ( !i && up ) return 
            let obj = Object.assign({},this.doc)
            parent.splice(i,1)
            parent.splice(i-up,0,this.doc)
        },
        moveDown(id){
            var parent = jp.parent ( this.$attrs.component  , '$..blocks[?(@.id=="' + id + '")]' )
            if ( parent.length === 1 ) return
            let i
            parent.forEach ( (p,index) => {
                if ( p.id === this.doc.id ){
                    i = index
                }
            })
            let obj = Object.assign({},this.doc)
            parent.splice(i,1)
            parent.splice(i+1,0,this.doc)
        },
        classe(css){
            if ( !css ) return 'relative'
            let cl = css.hasOwnProperty('css') ? css.css + ' ' + css.container : css
            //cl.replace('z-','')
            cl += this.$attrs.level === 0 ? ' z-1 ' : ' z-' + this.$attrs.level
            cl.indexOf('absolute') > -1 ? cl += ' absolute' : cl += ' relative'
            css.hasOwnProperty('align') ? cl+= ' ' + css.align : null
            return cl.replace('modal','').replace('hidden','')
        },
        setCurrent(el,e){
            //e.stopPropagation() 
            this.$store.dispatch( 'selected' , el.id )
            this.$store.dispatch ( 'setCurrent' , el )
        },
        
        // setCurrentElement (el){
        //     this.$store.dispatch( 'selected' , el.id )
        //     this.$emit ( 'selected' , el )
        // },
        
        arraySwap ( arr , from , to ){
            return arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
        },
        move(flag){
            let coord = []
            coord = coord.concat(this.coords)
            coord.push ( this.$attrs.index )
            let test = Object.assign({} , this.$attrs.component)
            let arr
            !this.$attrs.top ?
                arr = test.blocks[coord[1]].blocks[0].blocks :
                    arr = test.blocks 
            
            let source = arr[coord[coord.length-1]]
            let pos = coord[coord.length-1]
            if ( flag ){
                if ( pos > 0 ){     
                    arr.splice(pos-1,0,source)
                    arr.splice(pos+1,1)
                }
            } else {
                if ( pos < arr.length-1 ){
                    arr.splice(pos,1,arr.splice(pos+1, 1, arr[pos])[0])
                    
                }
            }
            !this.$attrs.top ?
                        test.blocks[coord[1]].blocks[0].blocks = arr :
                            test.blocks = arr
            return
            
            
        },
        /*
        blocksLen(obj,coord){
            let o = this.doc
            let len = 0
            coord.forEach ( index => {
                if ( o.hasOwnProperty ( 'blocks' ) ){
                    o = o.blocks
                    if ( o.length ) len = o.length
                    o = getObj (o,index)
                }
            })
            return len

            function getObj(obj,index){
                return obj[index]
            }
        },
        */
        customize(){
            console.log ( 'element customize')
            this.$emit('customize')
        },
        edit(block){
            this.$store.dispatch( 'selected' , block.id )
            this.$store.dispatch ( 'current' , block )
            this.$emit('selected',block)
            this.$emit('edit',block)
        },
        active(id,doc){
            if ( !doc ) return 
            if ( !this.view3D ){
                //this.doc.style = this.doc.style.replace('transform:','')
            }
              
            let color = 'border-blue-500 '
            doc && !doc.hasOwnProperty('type') ? color = 'border-red-500 ' : null
            doc && doc.hasOwnProperty('slider') ? color = 'border-yellow-500 ' : null
            doc && doc.hasOwnProperty('popup') ? color = 'border-teal-200 ' : null
            doc && doc.hasOwnProperty('plugin') ? color = 'border-orange-600 ' : null
            doc.type === 'flex' ?
                doc.hasOwnProperty('popup') ? color = 'border-teal-200 border-2 ' :
                    color = 'border-red-500 border-2 bg-gray-300 bg-opacity-0 ' : ''
            if ( this.editor && this.editor.selected ) {
                return this.editor.selected === id ? color + 'opacity-100 ' : color + 'opacity-0 hover:opacity-100'
            } else {
                return color + 'opacity-0 hover:opacity-100 '
            }
        },
        stile(block,doc){
            if ( !block || !doc ) return 
            let stile = ''
            if ( block.hasOwnProperty('fontFamily')){
                stile += 'font-family:\"' + block.fontFamily + '\"; '
            }
            return block.hasOwnProperty('style') ? block.style + stile : stile
        },
        videoBackground(block){
            let url = block.image.url.split('/')
            url.splice(url.length-1,0,'e_preview')
            return url.join('/')
        },
        background(block){
            if ( !block ) return 
            if ( block.image && block.image.url && block.image.url.indexOf('.mp4') > -1 ) return
                return block.hasOwnProperty('image') ?
                    block.image && block.image.url ? 
                        this.setImageBackground ( block.image ) : '' : ''

                        //' background-image:url(' + block.image.previewUrl + ');background-size:cover;background-repeat:no-repeat;' + this.isSvg(block.image) :
                        //    ' background-image:url(' + block.image.url + ');' : ''  : ''        
        },
        setImageBackground(image){ 
            if ( !image ) return ''
            //let theImg = image.hasOwnProperty('previewUrl')  && image.previewUrl ? image.previewUrl : image.url
            let response = ' background-image:url(' +  this.$imageURL(image) + ')' //theImg + ');'
            return response
        },
        pluginComponent(block){
            if ( block.plugin ){
                console.log ( block )
                if ( typeof block.plugin === 'string' ){
                    let name = block.plugin + '.editor'
                    console.log ( '@/components/plugins/' + name )
                    return MokaTest
                    let component =  import(/* webpackChunkName: 'nuxpresso_' */ '@/components/plugins/' + name ) 
                    return component ? component : false
                    //return component
                }
            }
            return false

        },
        
    },
    mounted(){
        /*
        window.addEventListener("keydown", e => {
            
            if ( e.altKey && e.code === 'ArrowDown' ){
                this.editor.current && this.editor.current.type === 'grid' ?
                    this.move(false) :
                        null
            }
        })
        */
    }

}
</script>