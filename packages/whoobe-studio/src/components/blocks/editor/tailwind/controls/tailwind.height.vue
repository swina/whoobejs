<template>
    <div class="flex flex-col">
        Height  
        <select class="w-full nodark" v-model="model" @change="$emit('input',model),$emit('css',model)">
            <option value=""></option>
            <option v-for="opt in options" :value="opt.value">{{ opt.label }}</option>
        </select>
    </div>
</template>

<script>
import classes from '@/scripts/tw.classes'
export default {
    data:()=>({
        model: '',
        /*
        options: [
            { label: 'auto', value: 'h-auto' }, 
            { label: '0' , value: 'h-0' } , 
            { label: '1' , value: 'h-1' } , 
            { label: '2' , value: 'h-2' } , 
            { label: '3' , value: 'h-3' } , 
            { label: '4' , value: 'h-4' } , 
            { label: '5' , value: 'h-5' } , 
            { label: '6' , value: 'h-6' } , 
            { label: '8' , value: 'h-8' } , 
            { label: '10', value: 'h-10'}, 
            { label: '12', value: 'h-12'} , 
            { label: '16', value: 'h-16'} , 
            { label: '20', value: 'h-20'} ,
            { label: '24', value: 'h-24'} , 
            { label: '32', value: 'h-32'} , 
            { label: '40', value: 'h-40'} , 
            { label: '48', value: 'h-48'} , 
            { label: '56', value: 'h-56'} , 
            { label: '64', value: 'h-64'} , 
            { label: '20%' , value: 'h-1/5'},
            { label: '25%' , value: 'h-1/4' },
            { label: '33%' , value: 'h-1/3' },
            { label: '50%' , value: 'h-1/2' },
            { label: '66%' , value: 'h-2/3' },
            { label: '75%' , value: 'h-3/4' },
            { label: '80%' , value: 'h-4/5' },
            { label: 'full',value: 'h-full' } , 
            { label: 'screen' , value: 'h-screen' }
        ],
        */
    }),
    computed:{
        options(){
            return classes[this.$attrs.attr]
        }
    },
    props: [ 'css' ],
    mounted(){
        if ( !this.css.length ) return
        let classes = this.css.split(' ')
        classes.forEach ( cl => {
            this.options.forEach ( opt => {
                if ( this.$clean(cl) === opt.value  ){
                    this.model = cl
                    this.$emit('input',cl)
                    this.$emit('css',cl)
                }
            })
        })
    }

}
</script>