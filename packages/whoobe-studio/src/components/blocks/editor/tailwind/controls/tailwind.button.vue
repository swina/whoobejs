<template>
    <i :key="$randomID()" :class="$attrs.classe + ' rounded pt-1 float-left px-1 border mt-2 material-icons mr-2 ' + active" @click="selected=!selected">{{$attrs.icon}}</i>
</template>

<script>
import classes from '@/scripts/tw.classes'
export default {
    name: 'MokaTailwindButton',
    data:()=>({
        selected: false
    }),
    
    props: [ 'css' ],
    computed:{
        active(){
            return this.selected ? 
                'border-white bg-blue-300 text-white' : 'border-transparent text-gray-600'
        }
    },
    watch:{
        selected(v){
            if ( v ){
                this.$emit('input', this.$attrs.attr)
                this.$emit ( 'css' , this.$attrs.attr )
            } else {
                this.$emit('input','')
                this.$emit('css','')
            }
        },
    },
    mounted(){
        if ( !this.css.length ) return
        let classes = this.css.split(' ')
        classes.forEach ( cl => {
            if ( this.$attrs.attr === cl ){
                this.selected = true
            }
        })
    },
    

}
</script>