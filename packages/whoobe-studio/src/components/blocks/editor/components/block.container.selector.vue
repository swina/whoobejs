<template>
    <div :class="'absolute transform border top-0 left-0 bottom-0 right-0 z-' + $attrs.zindex + ' ' + active(doc.id,doc)" @click="setCurrent(doc,$event),$action()" :id="doc.id" v-if="doc" @contextmenu="setCurrent(doc)">
            
        
        <span v-if="doc && doc.hasOwnProperty('loop') && doc.loop" class="text-xs"><i class="material-icons">article</i> 
            <span v-if="!doc.hasOwnProperty('collection')">Article Loop</span>
            <span v-else>{{ doc.collection }} Loop</span>
        </span>
        
        <span v-if="doc && doc.hasOwnProperty('blocks_flip')" class="text-xs"><i class="material-icons">flip_camera_android</i> Flipbox</span>
        
        <div class="h-2 w-2 absolute top-0 right-0 bg-lime-500 rounded-full -m-1" @click="moveUp(1)" title="click to move up"></div>
        
        <div class="h-3 w-3 absolute top-0 left-0 bg-blue-500 rounded-full -m-2" @dblclick="$action('block_add_element')" title="Dblclick to add an element"></div>
        
        <div class="h-2 w-2 absolute bottom-0 right-0 bg-lime-500 rounded-full -m-1" @click="moveUp(-1)" title="click to move down"></div>
        <div class="h-2 w-2 absolute bottom-0 left-0 bg-black rounded-full -m-1"></div>
        
        <span v-if="doc && doc.hasOwnProperty('slider')" class="px-4 py-1 rounded-xl text-sm bg-yellow-500">SLIDER</span>
        <!-- <div v-if="doc.type==='grid' || doc.type==='flex' || doc.type === 'menu'" class="opacity-100 hover:opacity-100 border rounded-tl rounded-bl bg-gray-800 absolute left-0 top-0 -mx-5 text-black flex flex-col" style="top:50%;transform:translateY(-50%)">
            <i class="material-icons hover:bg-indigo-700 text-white" title="Move up" @click="moveUp()">expand_less</i>
            <i class="material-icons hover:bg-indigo-700 text-white" title="Move down" @click="moveDown()">expand_more</i>
        </div> -->
           
    </div>
</template>

<script>
import { mapState } from 'vuex'
import jp from 'jsonpath'
export default {
    name: 'BlockContainerSelector',
    props: [ 'doc' ],
    data:()=>({
        coords: null
    }),
    computed:{
        ...mapState ( ['editor'] )
    },
    methods:{
        tooltip(){

            },
        active(id,doc){
            if ( !doc ) return 
            
            let color = 'border-blue-500 '
            doc && !doc.hasOwnProperty('type') ? color = 'border-red-500 ' : null
            doc && doc.hasOwnProperty('slider') ? color = 'border-yellow-500 ' : null
            doc && doc.hasOwnProperty('popup') ? color = 'border-teal-200 ' : null
            doc && doc.hasOwnProperty('plugin') ? color = 'border-orange-600 ' : null
            doc && doc.type === 'menu' ? color = 'border-pink-500 ' : null
            doc.type === 'flex' ?
                doc.hasOwnProperty('popup') ? color = 'border-teal-200 border-2 ' :
                    color = 'border-red-500 border-2 bg-gray-300 bg-opacity-0 ' : ''
            if ( this.editor && this.editor.selected ) {
                return this.editor.selected === this.doc.id ? color + 'opacity-100 ' : color + 'opacity-0 hover:opacity-100'
            } else {
                return color + 'opacity-0 hover:opacity-100 '
            }
        },
        setCurrent(el,e){
            //let level = this.$attrs.coords
            //level.push ( this.$attrs.index )
            this.$store.dispatch( 'selected' , this.doc.id )
            //this.$store.dispatch('setLevel',level)
            this.$store.dispatch ( 'setCurrent' , this.doc )
            if ( document.querySelector('#' + this.doc.id) ){
                let element = document.querySelector('#' + this.doc.id).getBoundingClientRect()
                this.coords = { 
                    x: element.x -57 + window.pageXOffset - parseInt(this.$attrs.root*8),
                    y: element.y - 66 + window.pageYOffset - parseInt(this.$attrs.root*8),
                    width: element.width,
                    height: element.height
                },
                this.editor.current.coords = this.coords
            } else {
                this.editor.current.coords = null
            }
            //this.$emit('selected',el)
        },
        moveUp(up){
            let component = this.editor.component.json
            var parent = jp.parent ( component , '$..blocks[?(@.id=="' + this.doc.id + '")]' )
            
            if ( parent.length === 1 ) return
            let i
            parent.forEach ( (p,index) => {
                if ( p.id === this.doc.id ){
                    i = index
                }
            })
            if ( i > 0 ){
                let obj = Object.assign({},this.doc)
                parent.splice(i,1)
                parent.splice(i-up,0,this.doc)
            }
        },
        // moveDown(){
        //     let component = this.editor.component.json
        //     var parent = jp.parent ( component , '$..blocks[?(@.id=="' + this.doc.id + '")]' )
        //     if ( parent.length === 1 ) return
        //     let i
        //     parent.forEach ( (p,index) => {
        //         if ( p.id === this.doc.id ){
        //             i = index
        //         }
        //     })
        //     let obj = Object.assign({},this.doc)
        //     parent.splice(i,1)
        //     parent.splice(i+1,0,this.doc)
        // },
        
    }
}
</script>