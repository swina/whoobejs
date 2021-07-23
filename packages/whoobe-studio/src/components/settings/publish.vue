<template>
    <div class="">
        <div>Publish</div>
        <div class="flex flex-col border-b w-full text-sm" v-if="project">
            <div class="grid grid-cols-2 justify-center items-center">
                <label>Name</label>
                <div class="p-1 ">{{ project.name }}</div>

                <label>Destination</label>
                <div class="p-1 text-purple-500 font-bold">{{ project.dist }}</div>

                <label>Target</label>
                <div class="p-1 ">{{ project.mode }}</div>

                <label>Source</label>
                <div class="p-1 col-span-2">
                    <span v-if="project.mode==='single'">{{ project.component.name }}</span><span v-else>NA</span>
                    <img :src="$imageURL(project.component.image)" v-if="project.mode==='single'" class="w-24 h-32 object-cover object-top"/>
                </div>

                <div class="p-1  capitalize">
                    <label>Fonts</label>
                </div>
                <textarea class="col-span-2 h-24 w-full dark"> {{ project.fonts }}</textarea>
                

                <div class="p-1  capitalize">
                    <label>Local assets <span v-if="uploads">[{{ uploads.length }}]</span></label>
                </div>

                <div class="flex flex-row flex-wrap justify-start  col-span-2 p-1 ">
                    <template v-for="(img,i) in project.uploads" v-if="project.mode==='single'">
                        <img v-if="i<5" :src="$imageURL(img)" class="w-10 h-10 object-cover object-top mr-2 mb-2"/>
                    </template>
                </div>
            </div>            


            <!-- <template v-for="setting in Object.keys(project)">
                <div class="p-1  capitalize"> {{ setting.replaceAll('/','\/') }} </div>
                <div class="p-1 "> 
                    <span v-if="setting != 'fonts' && setting!='mode'">{{ project[setting] }}</span>
                    <span v-if="setting === 'fonts' && fonts" v-html="fonts.join(', ')"></span>
                    <select v-if="setting==='mode'" v-model="project[setting]">
                        <option value="fullsite">Full site</option>
                        <option value="landing">Landing page</option>
                    </select>
                    <select class="ml-2" v-model="project.component" v-if="setting==='mode' && project.mode==='landing'">
                        <option></option>
                        <option v-for="component in landingPages" :value="component">{{ component.name }}</option>
                    </select>
                    <img :src="$imageURL(project.component.image)" v-if="project.component.image" class="h-24 object-cover"/>
                </div>
                
            </template> -->
            <!-- <div class="p-1 ">Images used as local asset</div> -->
            
            <!--<whoobe-used-images @images="setImages" :project="project" v-if="project.uploads"/>-->
            
            <div class="p-1 col-span-3 ">
                <blockquote>The system finds automatically which fonts and images (local) are used by your pages and will configure the relative generation process.</blockquote>
            </div>
        </div> 
        <div v-if="enabled" class="p-2 text-center">
            <button class="py-2 mx-1" @click="save">Save</button>
            <button class="py-2 mx-1" @click="generate">Generate</button>
        </div>
        <h3 v-if="!enabled">This option is available only in local development</h3>
        <div class="absolute top-0 left-0 flex flex-col" v-if="output">
            <textarea id="generated" v-model="output" style="font-family:monospace" class="text-sm w-full h-64 bg-black text-green-500 font-light ">
            </textarea>
            <textarea id="generated_errors" v-model="errors" style="font-family:monospace" class="text-base w-full h-64 bg-black text-red-400"></textarea>
        </div>
    </div>
</template>

<script>
// import "xterm/css/xterm.css";
// import { Terminal } from "xterm";
import WhoobeUsedImages from './used.images'
// const term = new Terminal({
//   rows: 40,
// });
import { mapState } from 'vuex'
import jp from 'jsonpath'
export default {
    name: 'WhoobeGenerator',
    components: { WhoobeUsedImages },
    data: () =>  ({
        project: null,
        output: '',
        errors: '',
        uploads: null ,
        fonts: null,
        generation: null,
        landingPages: null
    }),
    computed:{
        ...mapState ( ['editor'] ),
        cmsurl(){
            return window.localStorage.getItem('whoobe-cms')
        },
        
        enabled(){
            if ( typeof webpackHotUpdate === 'undefined') this.$store.dispatch('message','This option is available only in development mode')
            return typeof webpackHotUpdate != 'undefined' ? true : false 
        }
    },
    mounted(){
        // term.open(document.getElementById("terminal"));
        this.$api.service('generate').on ( 'created' , (data) => {
            
            if ( data.data ){
                this.output += data.data.normalize()
                //term.write ( data.data + '\n')
            } 
            if ( data.error ){
                this.errors += data.error.normalize()
            }
            document.getElementById("generated").scrollTop = document.getElementById("generated").scrollHeight 
            document.getElementById("generated_errors").scrollTop = document.getElementById("generated_errors").scrollHeight 
        })
        this.savePage()
        
        this.$api.service('components').find ( { query: { $limit: 100 , category: 'landing page'}}).then ( res => {
            this.landingPages = res.data
        })

    },
    methods: {
        setImages(images,fonts,purgeCSS ){
            this.uploads = images
            this.fonts = fonts
            this.fonts.push ( 'Barlow Condensed' )
            this.project.fonts = this.fonts
            this.project.uploads = images
            this.project.purge = purgeCSS
        },
        savePage(){
            //this.$loading ( true )
            let component = this.editor.component
            window.localStorage.setItem('whoobe-component',JSON.stringify(component) )
            delete component.autosave
            component.blocks_id ?
                component.blocks_id === component.json.id ?
                    null :
                        component.blocks_id = component.json.id 
                            : component.blocks_id = component.json.id
            this.$api.service ( 'components' ).patch ( component._id , component ).then ( res => {

            //this.$saveComponent ( component ).then ( res => {
                this.$loading(false)
                this.$message('Block saved')
                this.$action()
                console.log ( res )
                this.$api.service('projects').find( { query: { name: 'default' }}).then ( res => {
                    this.project = res.data[0]
                    this.project.mode = 'single'
                    this.project.landing = this.editor.component._id 
                    this.project.component = this.editor.component
                    this.projectConfig(component)
                })
            }).catch ( err => {
                this.$loading(false)
                this.$message('An error occured. Check you console log.')
                this.$action()
                console.log ( err )
            })
        },
        save(){
            // this.project.fonts = Array.isArray(this.project.fonts) ? this.project.fonts.join('|').replaceAll(' ','+') : this.project.fonts
            this.$api.service ( 'projects' ).patch ( this.project._id , this.project ).then ( res => {
                this.$message ( 'Page saved!')
            })
            // let project = this.project
            // this.$api.service ( 'projects' ).get ( project._id , project ).then ( res => {
            //     project.fonts = this.project.fonts.join('|')
            //     project.landing = project.component._id 
            //     project.single = project.component._id
            //     this.$api.service ( 'projects' ).patch ( project._id , project ).then ( res => {
            //         this.$message ( 'Page saved!')
            //     })
            // })
        },
        generate(){
            //this.project.fonts = this.project.fonts.join('|').replaceAll(' ','+')
            this.$api.service ( 'projects' ).patch ( this.project._id , this.project ).then ( res => {
                this.output = 'Starting generation ...\n'
                this.errors = ''
                this.$api.service('whoobe/build').create({project:this.project,uploads:this.project.uploads,fonts:this.project.fonts}).then ( res =>{
                    this.output += res.data
                })
            })
        },
        projectConfig(component){
            console.log ( 'component=> ' , component )
            let json = component.json
            let usedFonts = []
            let usedImages = []
            let purgeClasses = []
            let fonts = jp.query ( json , '$..blocks[?(@.style.includes("font-family"))]' )
            //usedFonts.push ( fonts.style )
            fonts.forEach ( font => {
                font.style.includes ( 'font-family') ?
                    usedFonts.push ( font.style.replace('font-family:','').replaceAll('\"','') ) : null
            })
            //let fonts = jp.query ( json , '$..blocks..[?(@.style>"font-family"]' )
            let images = jp.query ( json , '$..blocks..image.url' )
            images.forEach(img=>
                !img.includes('//') ?
                    usedImages.push(img) : null
            )
            let classes = jp.query ( json , '$..blocks..css' )
            
            classes.forEach ( classe => {
                let generalCSS 
                if ( classe.hasOwnProperty('css') ){
                    console.log ( 'Container => ' , Object.values(classe) )
                    generalCSS = classe.css.split(' ')
                    let containerCSS = classe.container.split( ' ' )
                    generalCSS.forEach ( css => {
                        if ( css ) purgeClasses.push ( css )
                    })
                    containerCSS.forEach ( css => {
                        if ( css ) purgeClasses.push ( css )
                    })
                    
                    
                } else {
                    generalCSS = classe.split(' ')
                    generalCSS.forEach ( css => {
                        if ( css ) purgeClasses.push ( css )
                    })
                }
            })
            this.project.fonts = [ ...new Set(usedFonts) ]
            this.project.purge = [ ...new Set(purgeClasses) ]
            this.project.uploads = [ ...new Set(usedImages) ]
            if ( component.json.fontFamily ){
                this.project.fonts.push ( component.json.fontFamily )
            }
        }
    }
}
</script>