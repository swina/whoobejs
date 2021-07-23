<template>
<div>
    <div :class="'editor-container min-h-screen top-0 right-0 left-0 bottom-0 flex flex-row'" v-if="hasblocks">
        <div class="w-full overflow-y-hidden overflow-x-hidden pb-64">
            
            <!-- MAIN CONTAINER -->
            <div main-editor-container :class="'relative mt-8 ml-4 mr-4 cursor-pointer'">
                <div :class="'main absolute top-0 left-0 bottom-0 right-0 z-max '" v-if="disable"></div>
                <!-- BLOCKS MAIN EDITOR -->
                <div :class="'mt-4 mb-10 ' + pageCss" :style="background + ';' + height">
                    
                    <block-selectors
                        class="h-full"
                        :key="doc.id"
                        :doc="doc"
                        :component="component"
                        :parent="component"
                        :develop="true"
                        :category="component.category"
                        :root="true"
                        @slidersettings="sliderSettings=!sliderSettings"
                        
                        @save="saveComponent" 
                        @preview="preview=!preview"
                        @slider="slider=!slider,disable=false"
                        @animations="animations=!animations"
                        @edit="editInline"
                        @copy="copyElement"
                        @paste="pasteElement"
                        @duplicate="duplicateElement"  
                        @saveblock="saveBlock"
                        @delete="removeElement"/>

                    <block-floating
                        class="z-highest" 
                        v-if="doc.id===editor.selected" 
                        :doc="doc"/> 
                </div>
                
                <div class="invisible absolute inset-0 flex flex-row p-1">
                    <template v-for="n in 12">
                        <div class="w-1/12" :class="'bg-opacity-50 bg-gray-' + (((n%2)+1)*100)">

                        </div>

                    </template>
                </div>
            </div>
        </div>
    </div>


</div>
</template>

<script>

import { mapState } from 'vuex'
import jp from 'jsonpath'

export default {
    name: 'BlockEditor',
    components: { 
        'block-selectors'   : () => import ( './block.selectors.vue' ),
        'block-floating' : () => import ( './components/block.floating.bar.vue')
    },
    //props:['component'],
    data:()=>({
        addType: false,
        newType: '',
        disable: false,
        addBlock:false,
        editContent: false,
        sliderSettings: false,
        animations: false,
        animation: '',
        breakpoint: 'md',
        fontFamily: 'Barlow Condensed',
        doc: null,
        current: null,
        importReusable: false,
        reusable: false,
        customize: false,
        media:false,
        settings: false,
        preview: false,
        slider: false,
        grids: false,
        grid: {
            cols: 1
        },
        mycomponent: null,
        printScreen: null,
        exportComponent: false,
        saveBlockAsComponent: false,
        copiedElement: null,
        newComponent: {
            name: 'A new component',
            description: 'A new component by MOKA',
            category: '',
            enabled: true,
            tags: ''
        },
        snapshot: null,
        html: null,
        createPage: false,
        page: {
            title: 'new page',
            categories: [],
            template_id: '',
            SEO: {
                title: 'new page',
                description: 'A SEO description '
            }
        },
        bodySettings: false,
        templateSettings: false,
        disableBodyCss: true,
        timer: null,
        endEditor: false,
        jsonToExport: null,
        docOptions:false,

    }),
    computed:{
        ...mapState ( ['moka','editor','datastore'] ),
        height(){
            console.log ( window.innerHeight )
            return 'min-height:' + (window.innerHeight - 120) + 'px'
        },
        //body settings in preview mode
        show(){
            return '' //return this.editor.action === 'in_editor_preview' ? 'hidden' : ''
        },
        devMode(){
             if ( typeof webpackHotUpdate === 'undefined' ) {
                 
                 return true //false
             }
             
             return true
        },
        body_settings(){
            return this.preview ?
                this.doc.body_bg  + ' ' + this.doc.body_color :
                    'w-full bg-white'
        },
        background(){
            if ( !this.doc.image ) return
            return 'background-image:url(' + this.$imageURL ( this.doc.image ) + ');'
        },
        pageCss(){
            if ( !this.doc ) return
            let d = new Date()
            d = d.getTime()
            return this.doc.css
            window.localStorage.setItem('moka-save',d)
            if ( this.disableBodyCss ) return ''    
            let css = this.doc.css + ' '
            if ( this.doc.hasOwnProperty ( 'body_bg' ) ){
                css += this.doc.body_bg
            }
            if ( this.doc.hasOwnProperty ( 'body_color' ) ){
                css += ' ' + this.doc.body_color
            }
            return css
        },
        //check if loaded component has blocks
        hasblocks(){
            //if ( !this.component ) this.$router.push('dashboard')
            this.component = this.$attrs.blocks
            this.doc = this.$attrs.blocks.json //this.component.json
            this.doc.id ? null : this.doc.id = this.$randomID()
            // this.page.template_id = this.$attrs.block.blocks_id
            // this.page.component = this.$attrs.block.id
            // this.page.blocks = this.$attrs.block
            // this.mycomponent = this.$attrs.block
            //this.$mapState().editor.component = this.$attrs.blocks
            return true
        },
        
        //import elements schema
        schema(){
            return this.datastore.dataset.elements.moka
        },
        
    },
    methods:{
        maincontext(){
            console.log ( 'main context menu')
        },
        addPlugin(plugin){
            let obj = {
                id : this.$randomID(),
                type: 'plugin',
                name: plugin.name,
                plugin: plugin,
                element: 'div',
                tag: 'plugin',
                css: '',
                style: '',
                icon: 'settings_input_component'
            }
            this.addReusable ( obj )
           
        },
         //export blocks as JSON file 
        exportJSON(){
            let json = JSON.parse(JSON.stringify(this.component))
            delete json.id
            delete json.autosave
            let vm = this
            
            if ( json.hasOwnProperty ( 'image' ) ){
                this.dataURI ( vm.$imageURL ( json.image ) ).then ( response => {
                    return response
                }).then ( dataUrl => {
                    json.image_uri = dataUrl
                    console.log ( json )
                    vm.jsonToExport = JSON.stringify ( json )
                    //return JSON.stringify ( json ) 
                })
            } else {
                vm.jsonToExport = JSON.stringify ( json )
                //return JSON.stringify ( json )
            }
            //this.$store.dispatch('loading')
        },
        async dataURI(image){
            let blob = await fetch(image).then(r => r.blob());
            let dataUrl = await new Promise(resolve => {
                let reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            return dataUrl
        },
        //add a grid as new block
        addGrid(grid){
            this.editor.current.blocks.push ( grid )
            //this.doc.blocks.push ( grid )
            this.grids = false
        },
        saveComponent(){
            if ( !this.devMode ){
                this.$store.dispatch('message','This option is available only in development mode')
                return 
            }

            //set current component before to save
            this.editor.current.component = this.doc 
            this.$store.dispatch('component',this.doc)
           
            //if ( this.articles ){
                // let inUseTemplate = this.articles.filter ( article => { 
                //     console.log ( article.component.id )
                //     return parseInt(article.component.id) === parseInt(this.component.id)
                // })
                // if ( inUseTemplate ){
                //     console.log ( 'savingPage ...')
                //     inUseTemplate.forEach ( templ => {
                //         templ.blocks = this.component
                //         this.$http.put ( 'articles/' + templ.id , templ ).then ( response => {
                //             console.log ( 'update article ' , templ.title )
                //         })
                //     })
                //     this.$emit('save')
                //     //inUseTemplate[0].blocks = this.$attrs.component
                //     //let updateArticle = inUseTemplate[0]
                //     //this.$http.put ( 'articles/' + updateArticle.id , updateArticle ).then ( response => {
                //     //    this.$emit('save')
                //     //})
                // } else {
                    this.$emit('save')
                //}
            // } else {
            //     this.$emit('save')
            // }
        },
        hasPages(){
            let css = 'text-red-500'
            return ''
                //this.articles.length === 1 ?
                    //this.$store.dispatch ( 'message' , 'This block is used as template by ' + this.articles[0].title + ' article') : 
                        //this.$store.dispatch ( 'message' , 'This block is used as template by ' + this.articles.length + ' articles' ) : css = ''
            //return css
        },
        //save new elements type
        saveNewType(){
            this.datastore.dataset.setup[0].types.components.push ( this.newType )
            this.$http.put ( 'elements' , this.moka.elements )
            this.newType = ''
            this.addType = false
        },
        //edit inline
        editInline(block){
            this.current = this.moka.current
            this.editContent = true
        },
        //save curren selected block
        saveBlock(block){
            this.current = block
            this.saveBlockAsComponent = true
        },
        //open reusable blocks selection
        reusableElement(current){
            this.reusable = true
        },
        //copy current element
        copyElement(current){
            delete current.parent
            let element = {}
            //element = Object.assign( {} , current )
            element = JSON.parse(JSON.stringify(this.editor.current))
            element = this.$clone ( element )
            element.id = this.$randomID()
            window.localStorage.setItem('whoobe-clipboard', JSON.stringify(element))
            this.copiedElement = element
            this.current = element
            this.$store.dispatch('message','Element copied')
        },
        //remove current element
        removeElement(){
            this.$findNode ( this.editor.current.id , this.doc , true  )
        },
        //paste current copied element
        pasteElement(){
            let clipboard = JSON.parse(window.localStorage.getItem('whoobe-clipboard'))
            //console.log ( clipboard )
            //console.log ( this.copiedElement.id )
            this.copiedElement = clipboard
            this.copiedElement.id = this.$randomID()
            let pastedElement = Object.assign ({}, this.copiedElement )
            pastedElement.id = this.$randomID()
            console.log ( pastedElement )
            this.addReusable ( pastedElement )
        },
        //duplicate current element
        duplicateElement(comp,current){
            //console.log ( component , current )
            //this.$block_duplicate(component,current)

            let component = comp //this.$mapState().desktop.tabs[this.$mapState().desktop.currentTab].blocks
            var parent = jp.parent ( component.json , '$..blocks[?(@.id=="' + current.id + '")]' )
            let i 
            if ( parent ){
                parent.forEach ( (p,index) => {
                    if ( p.id === current.id ){
                        i = index
                    }
                })
                let el = JSON.parse(JSON.stringify(this.editor.current))
                let obj = this.$clone ( el )
                obj.id = this.$randomID()
                parent.splice ( i+1 , 0 , obj )
                this.$message ( 'Element duplicated')
            }

            /*
            let el = JSON.parse(JSON.stringify(this.editor.current))
            let obj = this.$clone ( el )
            obj.id = this.$randomID()
            this.$findNode ( this.editor.current.id , this.moka.component.json )
            this.editor.parent.blocks.push ( obj )
            delete this.editor.current.parent
            */
        },

        //replace a basic HTML element (not containers)
        replaceElement(component){
            //console.log ( component )
            component.id = this.$randomID()
            let obj = JSON.parse(JSON.stringify(component))
            this.editor.current = obj 
            this.editor.parent[0][this.editor.parent[1]] = obj
            //console.log ( obj )
            delete obj.parent
            this.$store.dispatch('selected',obj.id)
            this.$store.dispatch('setCurrent',obj)
            this.$store.dispatch ( 'setAction' , null )
            this.$store.dispatch( 'setParent' , null )
        },
        // return current breakpoint (sm/md/lg)
        mobile(bp){
            return bp === this.breakpoint ? 'nuxpresso-icon-circle' : ''
        },
        // Add a new block to the component as a grid
        createGridNew(){
            let obj = JSON.parse(JSON.stringify(this.schema.containers[0]))
            obj['blocks'] = []
            obj.id = this.$randomID()
            //obj.css.container = "flex flex-col md:grid md:grid-cols-" + this.grid.cols
            obj.css.container = "grid md:grid-rows-1 md:grid-cols-" + this.grid.cols +  " grid-cols-1"  
            obj.css.css = ''
            obj.cols = parseInt(this.grid.cols)
            let content 
           //console.log ( obj.cols )
            for ( var n = 0 ; n < parseInt(this.grid.cols) ; n++ ){
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
            this.doc.blocks.push ( obj )
            //console.log ( obj )
            this.grids = false
        },
        addMultipleBlocks(reusable){
            reusable.json.blocks.forEach ( block => {
                //console.log ('multiple blocks=>' , block )
                let obj = { json: { blocks: [ block ] }}
                this.addReusable( obj )
            })
        },
        addObject(obj){
            this.reusable = false
            let component = {}
            let json , imported
            //console.log ( 'importing ... ' , obj )
            if ( obj.hasOwnProperty ( 'json' ) ){
                if ( !obj.json.hasOwnProperty('slider' ) ) {
                    imported = obj.json.blocks[0]
                    component = this.$clone(imported)
                } else {
                    imported = obj.json
                    component = this.$clone(imported)
                    console.log ( 'slider => ' , component )
                }            
            } else {
                imported = obj
                component = this.$clone(imported)
            }
            if ( component ){
                component['gsap'] = {
                    animation: '',
                    ease: '',
                    duration: 0,
                    delay:0
                }
                component.id = this.$randomID()
                let target = this.editor.current
                if ( !target || this.addBlock ){
                    target = this.doc
                }
                target.blocks.push ( component )
                this.addBlock = false
                //this.copiedElement = null
                this.$action()
            }
        },
        //add a reusable block (copied element or selected from the list)
        addReusable(component){
            this.addObject ( component )
            return
            //console.log ( id )
            if ( typeof id != 'object' ){
                this.$http.get('components/' + id ).then ( resp => {
                    let obj = resp.data
                    if ( !obj ) {
                        this.$store.dispatch('message','No objects in the clipboard')
                        return 
                    }
                    this.addObject ( obj )
                })
            } else {
                this.addObject ( id )
            }
        },
        //add an HTML element
        addComponent(component){
            let comp = {}
            comp = Object.assign ({} , component.json )
            comp.id = this.$randomID()
            let master = this.$getDoc ( this.doc , this.current.coords)
            if ( component.category != 'slider' ){
                let clone = comp
                if ( comp.tag === 'document' ){
                    clone = comp.blocks[0]
                }
                if ( component.hasOwnProperty ( 'blocks' ) ){
                    clone = this.$unique ( comp )
                }
                master.blocks.push ( clone )
            }
            
            this.importReusable = false
            this.reusable = false
        },
        //save screenshot of blocks
        save(screenshot){
            if ( screenshot ){
                this.mycomponent.image = screenshot
                this.mycomponent.image_uri = screenshot
                    //!screenshot.url.includes('http') ? 
                        //process.env.VUE_APP_API_URL + screenshot.url.replace('/','') : 
                            //screenshot.url
            }
            
            this.$emit('save')
        },
        //print an element (Ctrl+o)
        async printElement(id) {
            let el , options
            //console.log ( id )
            el = document.querySelector('.moka-block-preview')
            el = el.querySelector('#content')
            //console.log ( el )
            options = { type: "dataURL" , useCORS: true , scale: .70 }
            this.snapshot = await this.$html2canvas(el, options)
            this.$store.dispatch('message','Click on the image to download')
        }, 
        //save a block as a reusable one
        saveBlockAsNewComponent(){
            let id = this.$randomID()
            let newComponent = {
                blocks_id : id,
                name: this.newComponent.name,
                description: this.newComponent.description,
                category: this.newComponent.category,
                enabled: true,
                json: {
                        blocks : [ this.editor.current ],
                        css: '',
                        id: id,
                        image: null,
                        tag: 'document'
                },
                loop: null,
                loop_limit: null,
                loop_type: null                
            }
            this.saveBlockAsComponent = false
            this.$emit('saveasreusable', newComponent)
            return null
        },
        viewhtml(html){
            
            this.html = this.$beautify ( html.replaceAll('<!---->','').replaceAll('[object Object]','') )
        },
        checkAutosave(){
            let time = new Date()
            time = time.getTime()
            let lastSave = window.localStorage.getItem('moka-save')
            lastSave ?
                (time - lastSave) > (60*5*1000) ?
                    this.endEditor = true :
                        this.$router.push('dashboard') :
                            $router.push('dashboard')
        },
        openPreview(){
            window.localStorage.setItem('moka-preview',JSON.stringify(this.doc))
            window.localStorage.setItem('moka-settings', JSON.stringify(this.moka.settings))
            let route = this.$router.resolve({path: '/preview'});
            let w = window.open(route.href, 'moka','width=' + window.screen.availWidth );
            w.focus()
        },
        autoSave(){
            if ( !this.$attrs.blocks ) return 
            let blocks = {
                blocks: this.doc.blocks,
                lastUpdate: new Date()
            }
            let data = {
                autosave:  blocks
            }
            console.log ( 'Autosave data =>' , data )
            this.$loading(true)
            this.$api.service ( 'components' ).patch ( this.$attrs.blocks._id , data ).then ( result => {
                console.log ( result )
                console.log ( 'Autosaved =>'  , result )
                this.$loading()
            }).catch ( error => {
                this.$loading()
                console.log ( error )
                this.$message ( 'Autosave error please check your logs')
            })
        }    
    },
    watch:{
        preview(v){
            return v ? this.$store.dispatch('message','Alt+x to close - Alt+s to save with printscreen') : null
        },
        fontFamily(font){
            document.querySelector('#content').style.fontFamily = font
            this.doc.fontFamily = font
        },
        exportComponent(v){
            if ( v ){
                return this.exportJSON()
            }
        },
        
    },
    mounted(){
        let vm = this
        if ( vm.doc.blocks.length === 0 ){
            this.$store.dispatch('setCurrent',vm.doc)
            this.$store.dispatch('selected',vm.doc.id)
        }
        this.$store.dispatch('setComponent',this.$attrs.blocks)
        this.autoSave()
        this.timer = window.setInterval (()=>{
            vm.autoSave()
            // let blocks = {
            //     blocks: vm.doc.blocks,
            //     lastUpdate: new Date()
            // }
            // let data = {
            //     autosave:  blocks
            // }
            // console.log ( 'Autosave data =>' , data )
            // this.$loading(true)
            // this.$api.service ( 'components' ).patch ( vm.doc._id , data ).then ( result =>{
            //     console.log ( 'Autosaved =>'  , result.data )
            //     this.$loading()
            // }).catch ( error => {
            //     this.$message ( 'Autosave error please check your logs')
            // })
            // vm.$store.dispatch ( 'autoSave' , blocks )
            // window.localStorage.setItem('whoobe-autosave',JSON.stringify(blocks))
            
        }, 60000*5 )
        
    },
    beforeDestroy(){
        window.clearInterval(this.timer)
    }
}
</script>