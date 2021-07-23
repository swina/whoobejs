<template>
<div class="w-full overflow-y-auto z-2xtop h-screen text-xs theme-dark p-1 flex flex-col">
    <!--<i class="material-icons z-2xtop absolute top-0 right-0 m-1" @click="$emit('close')">close</i>-->
    <div v-if="components" class="mb-10 flex flex-row flex-wrap justify-around p-1 pb-48">
        Click on a item to add to the current block
        <template v-for="(template,index) in components">
            <div class="w-1/2 flex flex-col mb-4 h-36 cursor-pointer relative p-1 justify-center items-center" @click="addReusable(template)" :title="template.name">
                <span class="text-xs p-1">{{ template.name.substring(0,15) }}</span>
                <div v-if="template.image" :style="'background-image:url(' + $imageURL(template.image) + ')'" class="w-full h-24 bg-top bg-no-repeat bg-cover shadow-lg" ></div>
                <div v-if="template.image_uri && !template.image" :style="'background-image:url(' + $imageURL(template.image_uri) + ')'" class="w-full h-24 bg-top bg-no-repeat bg-cover shadow" ></div>
                <icon v-if="!template.image && !template.image_uri" name="view_quilt" class="text-8xl text-gray-700"/>
                <!-- <div v-if="!template.image && !template.image_uri" class="h-24 w-full shadow flex flex-col items-center justify-center"><div class="w-16 h-16 flex flex-col items-center justify-center  rounded-full bg-gray-300 text-gray-100">whoobe</div></div> -->
            </div>
        </template>
    </div>
    <div class="absolute bottom-0 w-full theme-dark h-10 p-2 flex flex-row justify-around items-center text-center">
        <i class="material-icons mx-2 text-2xl" @click="prev">chevron_left</i>
        <select v-model="filter" class="dark">
            <option v-for="cat in $mapState().datastore.components_categories" :value="cat.filter">{{ cat.filter }}</option>
        </select>
        <i class="material-icons" @click="search=!search">search</i>
        <i class="material-icons mx-2 text-2xl" @click="next">chevron_right</i>
    </div>
    <transition name="fade">
        <div v-if="search" class="absolute z-2xtop bottom-0 w-full mb-10 theme-dark p-2 grid grid-cols-2 gap-2">
             <button class="w-full capitalize text-xs border" @click="start=0,tags=''">all</button>
            <template v-for="tipo in datastore.dataset.elements[0].types.types">
                <button class="w-full text-xs capitalize " @click="tags=tipo">{{ tipo }}</button>
            </template>
        </div>
    </transition>
</div>
</template>

<script>
import { mapState } from 'vuex' 
export default {
    name: 'BlockReusable',
    props:['templates'],
    data:()=>({
        start: 0,
        limit: 8,
        filter: 'widget',
        tags: '',
        search: false,
        categories: [
            'component',
            'slider',
            'widget',
            'page',
            'template',
            'archive',
            'starred'
        ],
        loadedComponents: null,
        components: null
    }),
    mounted(){
        this.$api.service('components').find( { query : { category: this.filter , $skip:0 , $limit:200 } } ).then ( result => {
            this.loadedComponents = result.data
            this.components = result.data
        })
        //this.tags = this.datastore.dataset.elements[0].types.types
    },
    computed: {
        ...mapState ( ['desktop','datastore'] ),
        
        /*categories(){
            let arr = this.$arrayGroup ( this.mokacomponents , 'category' , 'id' )
            return arr.keys
        },
        mokatemplates(){
            //this.start = 0
            //this.limit = 8
            return this.mokacomponents.filter(comp=>{ return comp.category === this.filter || comp.tags === this.filter } )
        }
        */
    },
    watch:{
        filter(v){
            this.reusables()
            this.tags = ''
            this.search = false
        },
        tags(v){
            console.log ( v )
            if ( v ){
                this.components = this.loadedComponents.filter ( comp => { return comp.tags === v } )
            } else {
                this.components = this.loadedComponents
            }
        }
    },
    methods: {
        reusables(){
            this.$api.service('components').find( { query : { category: this.filter , $skip:0 , $limit:50 } } ).then ( result => {
                this.components = result.data
            })
        },
        next(){
            //if ( this.start < ( this.mokatemplates.length - this.limit ) ){
                this.start += this.limit
            //}
        },
        prev(){
            if ( this.start > 0 ){
                this.start -= this.limit
            }
            
        },
        addReusable(obj){
            if ( this.desktop.tabs[this.desktop.currentTab].mode === 'block' ){
                let component = {}
                let json , imported
                if ( obj.hasOwnProperty ( 'json' ) ){
                    if ( !obj.json.hasOwnProperty('slider' ) ) {
                        imported = obj.json.blocks[0]
                        component = this.$clone(imported)
                    } else {
                        imported = obj.json
                        component = this.$clone(imported)
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
                    //let target = this.$mapState().editor.current
                    //if ( !target || this.addBlock ){
                    //    target = this.doc
                    //}
                    if ( !this.$attrs.emit ){
                        this.$mapState().editor.current.blocks.push ( component )
                        this.$action()
                    } else {
                        this.$emit ( 'block' , component )
                    }
                }
            } else {
                this.$store.dispatch('setComponent',obj)
                this.$emit ( 'component' , obj )
            }
        }
    },
}
</script>