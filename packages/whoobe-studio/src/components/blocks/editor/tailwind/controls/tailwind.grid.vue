<template>
    <div class="flex flex-col">
        <!--<moka-customize-grid :cols="cols" :stile="editor.current.style" @grid="set_style"/>-->
        <div :class="'h-10 bg-gray-600 border-2 border-dashed items-center grid grid-cols-' + cols" :style="st">
            <div v-for="col in cols" class="p-1 flex flex-row border border-yellow-200 border-dashed ">
                {{grid_settings[col-1]}}fr
            </div>
        </div>
        <div v-for="n in cols">
            Col {{n}} <input type="range" min="1" max="10" step="0.05" :name="'col_' + (n-1)" v-model="grid_settings[n-1]" @change="grid_style"/>
        </div>
        <button @click="addCol" class="m-auto mt-2">Add column</button>
    </div>
</template>

<script>
import MokaCustomizeGrid from './tailwind.grid.customize'
import { mapState } from 'vuex'
export default {
    components: { MokaCustomizeGrid },

    data:()=>({
        classe:'', 
        cols:0,
        grid_settings:[],
        st:''
    }),
    computed:{
        ...mapState ( ['editor'] )
    },
    props: [ 'css' , 'stile' ],
    mounted(){
        this.st = this.stile
        this.cols = this.$attrs.entity.blocks.length
        this.editor.current.cols = this.cols
        this.st = this.$attrs.entity.style
        if ( this.cols > 1 ){
            this.st = ''
            if ( this.$attrs.entity.style ){
                let values = this.editor.current.style.split(':')[1]
                values = values.replace(';','')
                values = values.split(' ')
                console.log ( values , values.length )
                this.grid_settings = []
                let str = 'grid-template-columns:'
                for ( var n=0 ; n < this.cols ; n++ ){
                    if ( values[n] ){
                        this.grid_settings.push ( values[n].replace('fr','') )
                        str += values[n] + ' '
                    } else {
                        this.grid_settings.push ( 1 )
                        str += '1fr '
                    }
                }
                this.st = str + ';'
            } else {
                this.grid_settings = []
                for ( var n = 0 ; n < this.cols ; n++ ){
                    this.grid_settings[n] = 1
                }
            }   
        } else {
            this.st = ''
            this.grid_settings.push ( 1 )
        }
        this.$attrs.entity.css.container = "flex flex-col md:grid md:grid-cols-" + this.cols
    },
    watch: {
        st(v){
            return 
            //this.editor.current.style = v
            //this.$emit('stile',v)
        },
    },
    methods: {
        addCol(){
            let column = this.$flex()
            this.$attrs.entity.blocks.push ( column )
            this.cols++
            this.grid_settings.push ( 1 )
            this.$attrs.entity.css.container = "flex flex-col md:grid md:grid-cols-" + this.cols
            this.grid_style()
        },
        grid_style(){
            let str = 'grid-template-columns:'
            if ( this.grid_settings.length ) {
                this.grid_settings.forEach ( fr => {
                    str += fr + 'fr '
                })
                str += ';'
            } else {
                str = ''
            }
            this.st = str
            this.editor.current.style = this.st
        },
        update_style(){
            let str = 'grid-template-columns:'
            if ( this.editor.current.blocks.length === 1 ){
                str = ''
                this.cols = 1
                this.grid_settings = [1]
            } else {
                if ( this.grid_settings.length ) {
                    this.grid_settings.forEach ( fr => {
                        str += fr + 'fr '
                    })
                    str += ';'
                } else {
                    str = ''
                }
            }
            this.st = str
            this.$attrs.entity.css.container = "flex flex-col md:grid md:grid-cols-" + this.cols
            this.$emit( 'stile' , str )
        },
        set_style ( stile ){
            this.$emit ( 'stile' , stile )
        },

    }    
}
</script>