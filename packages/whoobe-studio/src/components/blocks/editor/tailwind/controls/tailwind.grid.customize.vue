<template>
    <div>

        <div>
            Columns Width {{ cols }}
            <!--
            <div class="grid grid-cols-2 border border-green-500" :style="grid_template()">  
                <div class="border border-dashed bg-gray-600 text-white text-center" v-for="n in cols">{{grid_settings[n-1]}}fr</div>
            </div>
            -->
            <!--
            <div class="flex flex-col">
                <div v-for="n in cols">
                    Col {{n}} <input type="range" min="1" max="10" step="0.1" :name="'col_' + (n-1)" v-model="grid_settings[n-1]"/>
                </div>
            </div>
            -->
            <!--<div>
                <span class="bg-red-300" v-if="parseInt(grid_tot)>100">{{ parseInt(grid_tot) }}%</span>
                <span class="bg-green-300" v-else>{{ parseInt(grid_tot) }}%</span>
            </div>
            -->
        </div>
        <!--<button class="w-full" @click="customize=!customize,grid_init()">Columns Settings</button>-->

    </div>
</template>

<script>
export default {
    data:()=>({
        columns:null,
        customize: false,
        grid_settings:[],
        
    }),
    props: [ 'cols' , 'stile'],
    watch: {
        cols(v){
            this.columns = this.cols
            this.grid_settings = []
            this.customize = false
        }
    },
    mounted(){
        //this.grid_init()
       
    },
    methods: {
        grid_init(){
            this.grid_settings= []
            for ( var n = 0 ; n < parseInt(this.cols) ; n++ ){
                    this.grid_settings.push ( 1 )
            } 
            if ( this.stile ){
                let values = this.stile.split(':')[1]
                values = this.$clean(values.replace(';',''))
                values = values.replaceAll('fr','').split(' ')
                console.log ( values )
                this.grid_settings = values
                //this.grid_settings = values.split(' ')
            }
            return true
        },
        grid_template(){
            if ( this.grid_settings ){
                let str = 'grid-template-columns:'
                for ( var n = 0 ; n < this.cols ; n++ ){
                    str += this.grid_settings[n] + 'fr '
                }
                str +=';'
                this.$emit('grid', str , this.grid_gap )
                return str
            } 
            return ''
        },
    }
}
</script>