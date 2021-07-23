<template>
    <div class="mt-10 relative bg-white p-0 border-none max-h-screen" style="min-width:30rem;min-height:25rem;" :class="is_full_screen">
        <!--<i v-if="!$attrs.embeded" class="material-icons absolute top-0 right-0 mt-1 mr-1 rounded-full cursor-pointer bg-red-500 text-white" @click="$emit('close')">highlight_off</i>-->
        <icon name="image" class="absolute top-0 right-0 -mt-8 z-highest mr-10 cursor-pointer" title="add image" @click="addImage"/>
        <icon name="fullscreen" class="z-highest absolute top-0 right-0 -mt-8 mr-2 cursor-pointer" title="fullscreen" @click="fullscreen=!fullscreen,$emit('fullscreen')"/>
       
            <quill-editor
                v-if="hasContent" 
                :style="'' + stile()"
                :class="$attrs.size?$attrs.size:''"
                class="mt-2 overflow-y-hidden pb-10"
                ref="editor"
                id="editor"
                v-model="content"
                :options="$attrs.mode? editorOptionsHeading : editorOptions"
                @input="$emit('input',content)"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                @change="onEditorChange($event)"
            /> 
        
        <transition name="fade">
            <modal-fullscreen 
                v-if="media"
                @close="media=!media">
                <div slot="title">Media</div>
                <div slot="content">
                    <media @close="media=false" @insertimage="setEditorImage"/>
                </div>
            </modal-fullscreen>
        </transition>



    </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import Quill from 'quill'
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/imageResize', ImageResize)

import typo from '@/scripts/typo.js'
import { mapState } from 'vuex'
import jp from 'jsonpath'
export default {
    name: 'MokaRichTextEditor',
    components:{
        quillEditor,
        'media' : ()=> import ( '@/components/media/media.vue')
    },
    data:()=>({
        iseditor: false,
        media: false,
        content: '',
        fullscreen: false,
        font: "Barlow Condensed",
        /*
        editorOptions: {
            modules: {
                imageResize: true,
                toolbar: {
                    container: [['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],

                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                        [{ 'direction': 'rtl' }],                         // text direction

                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color' : typo.colors },{ 'background' : typo.colors }],
                        //[{ 'color': [ '#000000', '#FFFFFF' , '#F7FAFC' , '#EDF2F7' , '#E2E8F0', '#CBD5E0', '#A0AEC0', '#718096','#4A5568' , '#2D3748', '#1A202C', '#FFF5F5', '#FED7D7', '#FEB2B2' , '#FC8181', '#F56565','#E53E3E', '#C53030', '#9B2C2C', '#742A2A', '#FFFAF0', '#FEEBC8','#FBD38D', '#F6AD55','#ED8936','#DD6B20','#C05621','#9C4221','#7B341E','#FFFFF0','#FEFCBF','#FAF089','#F6E05E','#ECC94B','#D69E2E','#B7791F','#975A16','#744210','#F0FFF4','#C6F6D5','#9AE6B4','#68D391','#48BB78','#38A169','#2F855A','#276749','#22543D','#E6FFFA','#B2F5EA','#81E6D9','#4FD1C5','#38B2AC','#319795','#2C7A7B','#285E61','#234E52','#EBF8FF','#BEE3F8','#90CDF4','#63B3ED','#4299E1','#3182CE','#2B6CB0','#2C5282','#2A4365','#EBF4FF','#C3DAFE','#A3BFFA','#7F9CF5','#667EEA','#5A67D8','#4C51BF','#434190','#3C366B','#FAF5FF','#E9D8FD','#D6BCFA','#B794F4','#9F7AEA','#805AD5','#6B46C1','#553C9A','#44337A','#FFF5F7','#FED7E2','#FBB6CE','#F687B3','#ED64A6','#D53F8C','#B83280','#97266D','#702459'] }, { 'background': [ '#000000', '#FFFFFF' , '#F7FAFC' , '#EDF2F7' , '#E2E8F0', '#CBD5E0', '#A0AEC0', '#718096','#4A5568' , '#2D3748', '#1A202C', '#FFF5F5', '#FED7D7', '#FEB2B2' , '#FC8181', '#F56565','#E53E3E', '#C53030', '#9B2C2C', '#742A2A', '#FFFAF0', '#FEEBC8','#FBD38D', '#F6AD55','#ED8936','#DD6B20','#C05621','#9C4221','#7B341E','#FFFFF0','#FEFCBF','#FAF089','#F6E05E','#ECC94B','#D69E2E','#B7791F','#975A16','#744210','#F0FFF4','#C6F6D5','#9AE6B4','#68D391','#48BB78','#38A169','#2F855A','#276749','#22543D','#E6FFFA','#B2F5EA','#81E6D9','#4FD1C5','#38B2AC','#319795','#2C7A7B','#285E61','#234E52','#EBF8FF','#BEE3F8','#90CDF4','#63B3ED','#4299E1','#3182CE','#2B6CB0','#2C5282','#2A4365','#EBF4FF','#C3DAFE','#A3BFFA','#7F9CF5','#667EEA','#5A67D8','#4C51BF','#434190','#3C366B','#FAF5FF','#E9D8FD','#D6BCFA','#B794F4','#9F7AEA','#805AD5','#6B46C1','#553C9A','#44337A','#FFF5F7','#FED7E2','#FBB6CE','#F687B3','#ED64A6','#D53F8C','#B83280','#97266D','#702459'] }],          // dropdown with defaults from theme
                        //[{ 'font': ['Barlow Condensed','Abel','Alice','Alegreya','Arial','Amethysta','Nunito Sans','Roboto','Quattrocento','Verdana','sans-serif','serif'] }],
                        [{ 'align': [] }],
                        
                        ['clean']    
                    ],
                    
                },
                
                
            },
            placeholder: 'Add your content ...',
            theme: 'snow'
        },
        */
        editorOptionsHeading: {
            modules: {
                imageResize: true,
                toolbar: {
                    container : [
                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        //[{ 'font': ['Barlow Condensed','Arial','Verdana','sans-serif','serif'] }],
                        [{ 'align': [] }],
                        ['link'],
                        ['clean']    
                    ],
                },
            },
            placeholder: 'Add your content ...',
            theme: 'snow'
        }
    }),
    watch:{
        content(txt){
            if ( this.$mode() === 'block' ){
                this.editor.current.content = txt
            }
        }
    },
    computed:{
        ...mapState ( ['editor']),
        hasContent(){
            this.$attrs.article ? this.content = this.$attrs.value : this.content = this.editor.current.content
            return true
        },
        is_full_screen(){
            return this.fullscreen ?
                'h-screen' : ''
        },
        editorOptions(){
            return { modules: {
                imageResize: true,
                toolbar: {
                    container: [['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                        [{ 'direction': 'rtl' }],                         // text direction
                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color' : typo.typo.colors },{ 'background' : typo.typo.colors }],
                        [{ 'align': [] }],
                        ['link'],
                        ['image'],
                        ['clean']    
                    ],
                    
                },
            },
            placeholder: 'Add your content ...',
            theme: 'snow'}
        }
    },
    methods: {
        addImage(){
            this.$mapState().editor.action = this.$mapState().desktop.tabs [ this.$mapState().desktop.currentTab ].mode
            //this.$action('media')
            this.media = true 
        },
        onEditorBlur(editor) {
            return null
        },
        onEditorFocus(editor) {
            return null
        },
        onEditorReady(editor) {
            return null
        },
        onEditorChange(editor){
            //create images array (uploads) to generate for the building
            let delta = editor.quill.editor.delta.ops
            let images = jp.query ( delta , '$..image')
            let uploads = []
            images.forEach ( image => {
                if ( image.includes(':') ){
                    let img = image.split(':')[2].split('/').splice(1)
                    uploads.push ( '/' + img.join('/') )
                }
            })
            this.$attrs.article.uploads = uploads
            return null
        },
        setEditorImage(img){
                this.media = false
                let image = this.$imageURL(img)
                this.$refs['editor'].quill.focus()
                let range = this.$refs['editor'].quill.getSelection();
                range ? 
                    this.$refs['editor'].quill.insertEmbed(range.index, 'image', image ) : //img.url ) :
                        this.$emit('message','Set a position in the editor to place the image')
        }, 
        stile(){
            if ( !this.editor.current ) return 
            let stile = ''
            if ( this.editor.current.hasOwnProperty('fontFamily')){
                stile += ''//'font-size:1rem;font-family:\"' + block.fontFamily + '\"; '
            } else {
                //let ff = document.querySelector('.ql-editor') 
                //ff.style.fontFamily = '"\Barlow Condensed\",sans-serif'
                stile = ''//'font-size:1rem;font-family:"\Barlow Condensed\",sans-serif;'
            }
            return this.editor.current.hasOwnProperty('style') ? this.editor.current.style + stile : stile
        }
    },
    beforeMount(){
        const Quill = require("quill");
        const {
            container,
            ImageExtend,
            QuillWatch
        } = require("quill-image-extend-module");

        const { ImageDrop } = require("quill-image-drop-module");

        const ImageResize = require("quill-image-resize-module");

        Quill.register("modules/ImageExtend", ImageExtend);
        Quill.register("modules/ImageResize", ImageResize);
        Quill.register("modules/imageDrop", ImageDrop);
        
    },
}
</script>

<style>
pre {
    border:0!important;
}
.ql-container {
    font-family: 'Arial';
}
.ql-toolbar {
    min-width: 30rem;
    padding:1px;
}
.ql-editor {
    overflow-y: auto;
    
    border:0;
    min-height:20rem;
    height:100%;
}

#editor > .ql-container {
  height: 100%;
  /* added these styles */
  flex: 1;
  display: flex; 
  flex-direction: column;
}

.ql-editor {
  height: 100%;
  /* added these styles */
  flex: 1;
  overflow-y: auto;
  width: 100%;
}
</style>