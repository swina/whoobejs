<template>
    <div class="z-highest" @contextmenu="showContext">
        <div class="preview-context-menu" ref="contextMenu" id="contextMenu" @mouseleave="hideContextMenu" style="left:-1000px;">
            <block-preview-context-menu @printscreen="printScreen=true" @html="showHtml=!showHtml"/>
            
            <!--
            <div class="p-1 hover:bg-white hover:text-black flex flex-row items-center" @click="$action('savecomponent')">
                <i class="material-icons mr-4">save</i>Save
            </div>
            <div class="p-1 hover:bg-white hover:text-black flex flex-row items-center" @click="componentPrint">
                <i class="material-icons mr-4">photo</i>Print Screen
            </div>
            <div class="border-b border-t p-1 border-gray-700 text-gray-700">Preview</div>
            <div class="p-1 hover:bg-white hover:text-black  flex flex-row items-center divide-y divide-gray-200" @click="showHtml=!showHtml">
                <i class="material-icons mr-4">code</i>HTML
            </div>
            <div class="p-1 hover:bg-white hover:text-black  flex flex-row items-center" @click="resizeTo(365)">
                <i class="material-icons mr-4">phone_iphone</i>Phone
            </div>
            <div class="p-1 hover:bg-white hover:text-black  flex flex-row items-center" @click="resizeTo(1024,768)">
                <i class="material-icons mr-4">tablet</i>Tablet
            </div>
            <div class="p-1 hover:bg-white hover:text-black  flex flex-row items-center" @click="resizeTo(0)">
                <i class="material-icons mr-4">laptop_mac</i>Laptop
            </div>
            -->
        </div>
        <!--<i class="material-icons z-highest text-5xl fixed top-0 right-0 text-gray-400" @click="closeMe">close</i>-->
        <block-preview 
            v-if="doc && !doc.hasOwnProperty('slider')" 
            :doc="doc" 
            :preview="true" 
            :loop="false" 
            :develop="true" 
            @save="$emit('save')"/>

        <!-- <moka-slider :key="doc.id" v-if="doc.hasOwnProperty('slider')" :develop="true" :embeded="true" :doc="doc" :editor="true"/>     -->

        <loading v-if="!doc"/>
        <modal size="lg" position="modal" class="z-highest" v-if="showHtml" @close="showHtml=!showHtml" buttons="none">
            <div slot="title">HTML</div>
            <div slot="content" class="h-4/5 text-black">
                <block-preview-html/>
            </div>
        </modal>
        <block-preview-printscreen v-if="printScreen" @printed="isprinted"/>
    </div>
</template>

<script>
// import WhoobePreviewContextMenu from '@/components/moka/editor/preview/whoobe.preview.context.menu'
// import MokaEditorPreview from '@/components/editor/preview/moka.preview'
// import WhoobePreviewHtml from '@/components/moka/editor/preview/whoobe.preview.html'
// import WhoobePreviewPrintscreen from '@/components/moka/editor/preview/whoobe.preview.printscreen'

import { mapState } from 'vuex'
export default {
    name: 'MokaWindowPreview',
    data:()=>({
        doc:null,
        showContextMenu: false,
        showHtml: false,
        printScreen: false,
        editScreenshot: true
    }),
    components: {
        //WhoobePreviewContextMenu , MokaEditorPreview , WhoobePreviewHtml , WhoobePreviewPrintscreen ,
        'block-preview-context-menu'    : () => import ( './window/block.preview.context.menu.vue'),
        'block-preview'                 : () => import ( '@/components/blocks/preview/block.preview.vue'),
        'block-preview-html'            : () => import ( './window/block.preview.html.vue' ),
        'block-slider'                  : () => import ( '@/components/blocks/preview/components/moka.slider.vue'),
        'block-preview-printscreen'     : () => import ( './window/block.preview.printscreen.vue')
    },
    computed: {
        ...mapState ( ['editor'] ),
        // doc(){
        //     let mydoc = JSON.parse(window.localStorage.getItem('whoobe-preview'))
        //     this.$mapState().editor.current = mydoc
        //     this.$mapState().editor.component = JSON.parse(window.localStorage.getItem('whoobe-component'))
        //     return mydoc
        // },
        devMode(){
             if ( typeof webpackHotUpdate === 'undefined' ) {
                 
                 return true //false
             }
             
             return true
        },
    },
    methods:{
        isprinted(){
            this.printScreen = false  
        },
        componentPrint(){
            this.$loading(true)
            this.showContext = false
            this.$message ( 'Print screen setup ...' )
            this.printScreen = true
        },
        hideContextMenu(){
            this.$refs.contextMenu.style.opacity = 0
            this.$refs.contextMenu.style.left = '-1000px'
        },
        showContext(e){
            console.log ( e.clientY , e.clientX , screen.availWidth )
            e.preventDefault()
            if ( e.clientX < (screen.availWidth - 300) ) {
                this.$refs.contextMenu.style.left = (e.clientX - 20) + 'px'
            } else {
                this.$refs.contextMenu.style.left = ( e.clientX - 300 - 20) + 'px'
            }
            this.$refs.contextMenu.style.top = (window.pageYOffset + e.clientY) + 'px'
            this.$refs.contextMenu.style.opacity = 1
        },
        closeMe(){
            window.close()
        },
        size(s){
            window.screen.width = s
        },
        save(screenshot){
            let component = JSON.parse(window.localStorage.getItem('whoobe-component'))
            if ( screenshot ){
                component.image_uri = screenshot.replace('.jpg','.webp')
                component.image = screenshot.replace('.jpg','.webp')
                this.$api.service ( 'components' ).patch ( component._id , component ).then ( res => {
                    console.log ( 'saved component => ' , component , res )
                    this.$action()
                })
            }

                // filerobot image editor -> to be implemented
                // window.localStorage.setItem('whoobe-image-url',this.$imageURL(screenshot) )
                // this.editScreenshot ? 
                //     this.$action ( 'filerobot' ) :
                //         this.$api.service ( 'components' ).patch ( component._id , component ).then ( res => {
                //             console.log ( 'saved component => ' , component , res )
                //             this.$action()
                //         })
            
        },
        //screenshot print
        saveprint(){
            if ( !this.devMode ){
                this.$message('This option is available only in development mode')
                return
            }
            this.$loading(true)
            this.printMe()
        },
        //print action
        async printMe(block='content') {
            
            if ( !this.devMode ){
                this.$message('This option is available only in development mode')
                return
            }
            let el , options
            el = document.querySelector('#' + block)
            if (!el){
                document.querySelector(block)
            }
            options = { type: "dataURL" , useCORS: true , scale: 0.50 }
            let screenshot = await this.$html2canvas(el, options)
            
            this.srcToFile ( screenshot ,  'w-preview-' + this.$mapState().editor.component.name.replaceAll(' ','') + '.jpg' , 'image/jpg' ).then ( resp => { 
                //console.log ( 'src to file => ' , resp )
                let formData = new FormData()

                formData.append("file", resp )
                formData.append("folder","preview")
                formData.append("isPreview",true)
                formData.append('thumbs',0)
                formData.append('url','/uploads/preview/w-preview-' + this.$mapState().editor.component.name.replaceAll(' ','') + '.jpg')
                this.$http.post("upload/file", 
                    formData ,
                    {   
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                }).then ( response => {
                    console.log ( response )
                    screenshot = response.data.url
                    this.save(screenshot)
                    this.$loading()
                    return screenshot
                }).catch ( error => {
                    this.$loading()
                    this.$message ( 'An error occured. Check your console log')
                    //console.log ( error )
                })
            })

        }, 
        async srcToFile(src, fileName, mimeType){
            return (fetch(src)
                .then(function(res){return res.arrayBuffer();})
                .then(function(buf){return new File([buf], fileName, {type:mimeType});})
            );
        },
        
    },
    mounted(){
        console.log ( this.$route.params.slug )
        if ( this.$route.params.slug ){
            this.$api.service ( 'articles' ).find ( { query : { slug : this.$route.params.slug }} ).then ( res => {
                let mydoc = res.data[0].blocks.json
                this.$mapState().editor.current = mydoc
                this.$mapState().editor.component = JSON.parse(window.localStorage.getItem('whoobe-component'))
                this.doc = mydoc
            })
        } else {
            let mydoc = JSON.parse(window.localStorage.getItem('whoobe-preview'))
            this.$mapState().editor.current = mydoc
            this.$mapState().editor.component = JSON.parse(window.localStorage.getItem('whoobe-component'))
            this.doc = mydoc
        }
        let width = window.localStorage.getItem ( 'whoobe-preview-mode')
        if ( width ){
            window.resizeTo (width ? width : window.screen.availWidth , window.screen.availHeight)
            
        }
        document.title = 'whoobe'
    }
}
</script>