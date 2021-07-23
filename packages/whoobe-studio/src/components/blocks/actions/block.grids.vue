<template>
    <div class="w-full flex flex-col text-xs p-4 z-highest">
        <button v-if="grid" @click="grid=null" class="items-center flex flex-row px-4"><i class="material-icons">chevron_left</i> Grids</button>
        Click on a template to select a grid 
        <template v-for="min in max">
            <span v-if="grid===min || !grid">Grid {{ min }} cols</span>
            <div v-if="!grid" :class="'gap-1 w-full items-center h-10 mb-1 grid md:grid-cols-' + min" @click="grid=min,selected=null">
                
                <div v-for="n in min" class="cursor-pointer border border-dashed text-center bg-gray-600 rounded">
                     {{ n }} / {{ min }}
                </div>
            </div>
        </template>
        <div v-if="grid ">
            
            <!--<div :class="'gap-1 grid grid-cols-' + grid">
            <template v-for="n in grid">
                <div  class="border border-dashed text-center bg-blue-200 rounded">
                     {{ n }} / {{ grid }}
                </div>
            </template>
            </div>-->
                <div v-if="grid > 2">
                    Column Spans for grid {{ grid }} cols. Click on a grid template to select.
                    <div v-for="span in spans[grid]">
                        <div :class="'w-full my-2 gap-1 grid grid-cols-' + grid">
                            <div v-for="sp in span" :class="'cursor-pointer font-bold border border-dashed text-center bg-purple-700 rounded col-span-' + sp" @click="selected=span">
                                {{ sp }}
                            </div>
                        </div>
                    </div>
                </div>
                
                    <div v-if="selected && grid > 2">GRID SELECTED</div>
                    <div v-if="selected" :class="'w-full my-4 gap-1 grid grid-cols-' + grid">
                        <div v-for="col in selected" :class="'cursor-pointer font-bold border border-dashed text-center bg-orange-500 rounded col-span-' + col">
                            {{ col }}
                        </div>
                    </div>
                <!--<div v-if="selected" class="flex flex-col">

                    <div><span class="font-bold">HTML </span>(responsive breakpoint added): <br/>
                        <textarea class="w-1/2 h-32" style="font-family:monospace" :value="container" />
                    </div>
                </div>-->
                <!-- <button class="m-auto w-24" v-if="selected" @click="$emit('grid',obj)">Add Grid</button> -->
                <button class="m-auto w-24" v-if="selected" @click="addGrid(obj)">Add Grid</button>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'MokaGrids',
    data:()=>({
        grid: null,
        selected:null,
        min: 1,
        max: 6,
        spans: {
            "1" : [ [1] ],
            "2" : [ [1 , 1] ],
            "3" : [ [1,1,1] , [1,2] , [2,1] ],
            "4" : [ [1,1,1,1], [2,2] , [1,3] , [1,1,2] , [1,2,1] , [ 2 , 1 , 1] , [ 3,1 ] ] ,
            "5" : [ [1,1,1,1,1],[1,1,1,2] , [1,1,3] , [1,4] , [1,1,2,1] , [1,2,1,1] , [ 1, 3 ,1] , [ 2,1,1,1] , [3,1,1] , [3,2] , [4,1] ],
            "6" : [ [1,1,1,1,1,1],[1,1,1,1,2] , [1,1,1,3] , [1,1,4] , [1,5] , [1,1,1,2,1] , [1,1,2,1,1] , [1,1,3,1] , [1,2,1,1,1] , [1,3,1,1] , [1,4,1] , [2,1,1,1,1] , [3,1,1,1] , [4,1,1] , [5,1] ]
        },
        obj: null
    }),
    computed:{
        ...mapState(['moka','datastore','editor']),
        schema(){
            return this.datastore.dataset.elements[0].moka //this.moka.elements.moka
        },
        
        container(){
            
            if ( !this.obj ) return ''
            let html = ''
            html += '<div class="' + this.obj.css.container + '">\n'
            this.obj.blocks.forEach ( block => {
                html += '\t<div class="' + this.$clean(block.css.container.replace('flex flex-col','').replace('md:col-span-1','')) + '"></div>\n'
            })
            html += '</div>'
            return html
        }
    },
    watch:{
        grid(v){
            if ( v && v < 3 ){
                this.selected = this.spans[this.grid][0]
            }
        },
        selected(v){
            if ( v ){
                let schema = !this.$attrs.loop ? this.schema.containers[0] : this.schema.containers.filter ( container => container.label === 'Articles Grid' )[0]
                console.log ( schema )
                let obj = JSON.parse( JSON.stringify(schema) ) //JSON.parse(JSON.stringify(this.schema.containers[0]))
                obj.blocks = []
                obj.id = this.$randomID()
                obj.css.container = "grid md:grid-cols-" + this.grid +  " grid-cols-1"
                obj.css.css = ''
                this.$attrs.loop ? this.$attrs.element.hasOwnProperty('collection') ? obj.label = this.$attrs.element.collection : obj.label = 'Articles Grid' : null
                obj.cols = parseInt(this.grid)
                this.$attrs.element && this.$attrs.element.hasOwnProperty('collection') ? obj.collection = this.$attrs.element.collection : null
                for ( var n = 0 ; n < v.length ; n++ ) {
                    let column = JSON.parse(JSON.stringify(this.schema.containers[1]))
                    column.blocks = []
                    column.css.container = 'flex flex-col md:col-span-' + v[n]
                    column.id = this.$randomID()
                    //let content = JSON.parse(JSON.stringify(this.schema.text[2]))
                    //content.id = this.$randomID()
                    //column.blocks.push ( content )
                    obj.blocks.push ( column )
                }
                this.obj = obj
            }
        }
    },
    methods:{
        addGrid(obj){
            this.editor.current.blocks.push ( obj )
            this.$action()
        }
    }
}
</script>