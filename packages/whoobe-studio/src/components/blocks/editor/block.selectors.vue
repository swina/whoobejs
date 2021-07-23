<template>
<!-- MAIN CONTAINER -->
<div class="w-full h-auto top-0 left-0 relative" data="init">
     
    <div v-if="$attrs.category!='element' && !doc.hasOwnProperty('slider')" @contextmenu="showContext">
        
        <!-- shadow-inner border-inset border-2 border-dashed border-purple-300 p-4-->
        <div class="relative p-0 text-black" :class="docCss + ' '" :style="stile(doc,true) + ' ' + background(doc)" id="content"  title="block component">
            <template v-for="(block,b) in doc.blocks">
                
                <block-container 
                    v-if="block && !block.hasOwnProperty('slider') && block.type!='slides'"
                    :key="block.id" 
                    :doc="block"
                    :component="doc" 
                    :level="b"
                    :index="b"
                    :slide="false"
                    :top="true" 
                    :pos="[0,b]"
                    :coords="[0,b]" 
                    :zi="b+1"
                    @selected="selected"/>
                
                <block-slides 
                    v-if="block && block.type==='slides'"
                    :key="block.id" 
                    :doc="block"
                    :component="doc" 
                    :level="b"
                    :index="b"
                    :slide="false"
                    :top="true" 
                    :pos="[0,b]"
                    :coords="[0,b]" 
                    :zi="b+1"
                    @selected="selected"/>

                <div v-if="block && block.hasOwnProperty('slider')" class="border p-1">
                    <div class="p-2 bg-gray-300">SLIDER <button class="danger" @click="removeSlider(block)">Remove</button></div>
                    <moka-editor-selectors 
                        :doc="block"
                        :component="current"
                        :develop="true"
                        category="slider"
                        :root="true"
                        />  
                </div>
            </template>
            <!-- <block-editor-slider v-if="$attrs.component.hasOwnProperty('slider')"
                :doc="$attrs.component"
            /> -->

            <div @click="selectDoc(doc)" class="absolute top-0 -mr-2 -mt-6 w-full text-center flex flex-row items-center justify-center rounded-tl-lg rounded-tr-lg text-sm text-white" :class="doc.id!=editor.selected?'bg-gray-900':'bg-purple-600'">
                Document
            </div>
        </div>
        
    </div> 
    <div v-else class="relative shadow-inner border-inset border-2 border-dashed border-purple-300 p-10 text-black" :class="docCss + ' '" :style="stile(doc,true) + ' ' + background(doc)" id="content"  title="block component">
        <block-editor-slides
            v-if="doc && doc.hasOwnProperty('slider')"
            :key="doc.id"
            :doc="doc"
            :component="doc"/>
    </div>
    <block-status-bar :component="component"/>

    <!-- context menu -->
    <div class="editor-context-menu z-highest rounded border-gray-900 border shadow-lg text-xs" ref="contextMenu" id="contextMenu" style="left:-1000px" @mouseleave="hideContextMenu" @click="hideContextMenu">
        <context-menu 
            @delete="confirmModal=!confirmModal" 
            :current="current" 
            :id="$randomID()" 
            :key="$randomID()" 
            @click="hideContextMenu"/>
        <!-- <component :is="contextMenuComponent" @delete="confirmModal=!confirmModal" :current="current" :component="component" :id="$randomID()" :key="$randomID()" @click="hideContextMenu"/> -->
    </div>
    
    <!-- DELETE OBJECT MODAL -->
    <transition name="fade">
        <modal
            :fixed="true"
            size="sm"
            position="modal"
            buttons="standard" 
            :close="true"
            v-if="confirmModal||editor.action==='delete'"
            @close="confirm=false,confirmModal=false,$action()"
            @click_0="confirm=false,confirmModal=false,$action()"
            @click_1="confirm=true,confirmModal=!confirmModal,removeElement()">
            <div slot="title">Delete object</div>
            <div slot="content" class="p-4">
                Remove the selected object?
            </div>
        </modal>
    </transition>
</div>
</template>

<script>
//import WhoobeEditorActions from '@/components/moka/editor/whoobe.editor.actions'
//import WhoobeSideBar from '@/components/moka/editor/components/whoobe.editor.side.bar'
//import WhoobeStatusBar from '@/components/moka/editor/components/whoobe.editor.status.bar'
//import WhoobeContainer from '@/components/moka/editor/components/whoobe.editor.container'
//import WhoobeEditorContextMenu from '@/components/moka/editor/components/whoobe.editor.context.menu'
import BlockEditorSlides from './components/moka.editor.slides'
//import gsap from 'gsap'
//import gsapEffects from '@/plugins/animations'
import { mapState } from 'vuex' 
import jp from 'jsonpath'

export default {
    name: 'BlockSelectors',
    data:()=>({
        customizerID: 0,
        //customizePos: 'right-0',
        //customizeSwitch: false,
        //dropdownView: false,
        confirm: false,
        confirmModal: false,
        //printScreen: null,
        current: null,
        toolbar: false, 
        customize: false,
        editContent: false,
        fullscreen: false,
        editCSS: false,
        animations:false,
        media: false,
        breakpoint: 'md',
        tree: false,
        copiedCSS: '',
        currentSlide: null,
        slideIndex: 0,
        slideDelete: false,
        help: false,
        position: {
            x: null,
            y: null
        }
    }),
    components: { 
        'block-container'   : () => import ( './components/block.container.vue' ),
        'block-slides'      : () => import ( '@/components/plugins/slides/slides.editor.vue' ),
        'block-status-bar'  : () => import ( './components/block.status.bar' ),
        //'block-editor-slider' : () => impoert ( './components/block.editor.slider.vue' )
        // WhoobeEditorActions,
        // WhoobeContainer,
        // WhoobeSideBar,
        // WhoobeStatusBar,
        // WhoobeEditorContextMenu,
        BlockEditorSlides
    },
    props: [ 'doc' , 'component' ],
    
    computed: {
        ...mapState ( ['editor'] ),
        
        init(){
            this.current = this.editor.current

            return true
        },
        docCss(){
            return this.doc.id === this.editor.selected ? 'border border-red-500' : 'border border-red-300'
        },
        gsapAnimations(){
            return gsapEffects
        },
        coords(){
            return this.current.coords
        },
        
    },
    watch: {
        component(c){
            return null
        },

    },
    methods: {
        active(id){
            return this.editor.current && this.editor.current.id === id ?
                'border-orange-500' : 'border-transparent'
        },
        selectDoc(doc,e){
            this.$store.dispatch('setCurrent',doc)
            this.$store.dispatch('selected',doc.id)
            this.$action()
        },
        selected(el){
            // this.current = el 
            // this.$store.dispatch('setCurrent',el)
        },
        stile(block,doc){
            if ( !block ) return 
            let stile = ''
            if ( block.hasOwnProperty('fontFamily')){
                stile += 'font-family:\"' + block.fontFamily + '\"; '
            }
            stile += block.hasOwnProperty('style') ? block.style : ''
            return stile 
        },
        background(block){
            if ( !block ) return 
            return block.hasOwnProperty('image') ?
                block.image && block.image.url ? 
                    block.image.previewUrl ? 
                        ' background-image:url(' + block.image.previewUrl + ');background-size:cover;background-repeat:no-repeat;' :
                            ' background-image:url(' + block.image.url + ');' : ''  : ''        
        },
        removeElement(){
            this.$emit ( 'delete' )
            this.$action()
            this.confirmModal = false
            return
        },
        removeSlider(block){
            this.$store.dispatch('setCurrent',block)
            this.$store.dispatch('selected',block.id)
            this.removeElement()
        },
        
        openPreview(){
            window.localStorage.setItem('whoobe-preview',JSON.stringify(this.doc))
            window.localStorage.setItem('whoobe-component',JSON.stringify(this.editor.component))
            let route = this.$router.resolve({path: '/preview'});
            let width
            window.localStorage.getItem('whoobe-preview-mode') ?
                width = window.localStorage.getItem('whoobe-preview-mode') :
                    width = window.screen.availWidth
            console.log ( window.screen.availWidth )
            let w = window.open(route.href, 'whoobe','width=' + width  );
            w.focus()
        },
        hideContextMenu(){
            if ( this.$refs.contextMenu ){
                this.$refs.contextMenu.style.opacity = 0
                this.$refs.contextMenu.style.left = "-1000px"
            }   
        },
        showContext(e){
            e.preventDefault()
            this.$refs.contextMenu.style.opacity = 1
            
            
            if ( e.clientX < ( (window.innerWidth*.85)   - 300) ) {
                 this.$refs.contextMenu.style.left = (e.clientX - 20) + 'px'
            } else {
                if ( e.clientX < 200 ){
                    this.$refs.contextMenu.style.left = '20px'
                } else {
                    this.$refs.contextMenu.style.left = ( e.clientX - 300 - 20) + 'px'
                }
            }
            let coords = this.$refs.contextMenu.getBoundingClientRect()
            let yPos = e.clientY + this.$refs.contextMenu.getBoundingClientRect().y
            let scrollTop = document.querySelector('.editor-container').scrollTop
            console.log ( scrollTop  )
            if ( scrollTop === 0 ){
                this.$refs.contextMenu.style.top = scrollTop //e.clientY - coords.height/2
                return
            }
            if ( yPos > (scrollTop) ){
                this.$refs.contextMenu.style.top = (scrollTop + window.innerHeight - this.$refs.contextMenu.clientHeight - 100) + 'px'
                return
            } else {
                if ( e.clientY < 250 ){
                    this.$refs.contextMenu.style.top = scrollTop ? scrollTop + 50  + 'px': 50  + 'px'    
                } else {
                    this.$refs.contextMenu.style.top = scrollTop + 'px'
                }
            }
            
            //console.log ( yPos , e.clientY , window.innerHeight - this.$refs.contextMenu.clientHeight )
            
            //console.log ( this.$refs.contextMenu.getBoundingClientRect().y )
        },
        duplicateElement(){
            let current = this.current
            delete current.parent  

            var parent = jp.parent ( this.component.json , '$..blocks[?(@.id=="' + current.id + '")]' )
            let i 
            if ( parent ){
                parent.forEach ( (p,index) => {
                    if ( p.id === current.id ){
                        i = index
                    }
                })
                let el = JSON.parse(JSON.stringify(current))
                let obj = this.$clone ( el )
                
                //obj.id = randomID()
                parent.splice ( i+1 , 0 , obj )
                this.$message('Element duplicated')
            }
        },
    },
    mounted(){  
        let vm = this 
        //this.current = this.doc.blocks[0].blocks[0]
        //this.$store.dispatch('setCurrent',this.current)
        window.addEventListener("keydown", e => {
            if ( e.altKey && e.code === 'KeyB' ){
                this.$action('in_editor_preview') 

                //this.doc && !this.doc.hasOwnProperty('slider') ?

                //    vm.$emit('preview') :
                //        vm.$emit('slider')
            }
            if ( e.altKey && e.code === 'KeyN' ){
                vm.openPreview()
            }

            if ( e.altKey && e.code === 'KeyL' ){
                if (window.CustomEvent) {
                    document.getElementById(this.$mapState().editor.current.id).dispatchEvent(new CustomEvent('contextmenu'))
                }
            }
            if ( e.altKey && e.code === 'KeyZ' ){
                if ( this.editor.current  ){
                    this.$action()
                    this.$action('customize')
                    //this.$emit('customize')
                    //this.customize =! this.customize
                }
            }
            if ( e.altKey && e.code === 'KeyW' ){
                if ( this.editor.current  ){
                    this.$action()
                    this.$action('block_edit')
                    this.$emit('edit',this.current)
                }
            }
            if ( e.altKey && e.code === 'KeyA' ){
                if ( this.editor.current  ){
                    this.$action ( 'animation' )
                }
            }
            if ( e.altKey && e.code === 'KeyG' ){
                if ( this.editor.current  ){
                    this.editor.current.css.hasOwnProperty('css') ?
                        this.copiedCSS = this.editor.current.css.css :
                            this.copiedCSS = this.editor.current.css
                }
            }
            if ( e.altKey && e.code === 'KeyH' ){
                if ( this.editor.current  && this.copiedCSS ){
                    this.editor.current.css.hasOwnProperty('css') ?
                        this.editor.current.css.css = this.copiedCSS :  
                            this.editor.current.css = this.copiedCSS
                }
            }
            if ( e.altKey && e.code === 'KeyC' ){
                if ( this.editor.current ){
                    this.$message('Element copied')
                    this.$emit('copy',this.editor.current)
                }
            }
             if ( e.altKey && e.code === 'KeyX' ){
                if ( this.editor.current ){
                    this.$emit('copy',this.editor.current)
                    this.$emit('delete')
                    //this.$store.dispatch ( 'setAction' , 'snapshot' )
                }
            }
            if ( e.altKey && e.code === 'KeyV' ){
                if ( this.editor.current  ){
                    this.$emit('paste')
                }
            }
            if ( e.altKey && e.code === 'KeyD' ){
                if ( this.editor.current  ){
                    //this.$emit('duplicate',this.current)
                    this.$mapState().editor.component = this.component
                    this.$emit('duplicate',this.component,this.$mapState().editor.current)
                    //this.$block_duplicate(this.$mapState().editor.component,this.$mapState().editor.current)
                    //this.$emit('duplicate',this.editor.current)
                }
            }

            if ( e.altKey && e.code === 'KeyQ' ){
                if ( this.editor.current && this.editor.current.type === 'flex'  ){
                    this.$action('addcomponent')
                    //this.$store.dispatch ( 'setAction' , 'addcomponent' )
                }
            }
            if ( e.altKey && e.code === 'KeyO' ){
                if ( this.editor.current ){
                    this.$action('snapshot')
                    //this.$store.dispatch ( 'setAction' , 'snapshot' )
                }
            }
            if ( e.altKey && e.code === 'KeyR' ){
                if ( this.editor.current  ){
                    this.$action('delete')
                    this.confirmModal =! this.confirmModal
                }
            }
           
            if ( e.altKey && e.code === 'KeyT' ){
                this.$action('tree')
                //this.tree =! this.tree
            }

           
            if ( e.altKey && e.code === 'KeyI' ){
                this.$action ( 'block_add_element' )
                //this.$store.dispatch ( 'setAction' , 'addcomponent' )
            }
            if ( e.altKey && e.code === 'KeyU' ){
                this.$action ( 'addreusable' )
                //this.$store.dispatch ( 'setAction' , 'addreusable' )
            }
            if ( e.altKey && e.code === 'KeyS' ){
                this.$action('savecomponent')
            }
        })

    }

}
</script>
