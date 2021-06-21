<template>
    <component class="iconify" :class="classe" :data-icon="icon" v-if="component" :is="component" :component="component"/>
</template>

<script>
import Iconify from '@iconify/iconify';
export default {
    name: 'IconExtra',
    data:()=>({
        id : null,
        component: 'i',
        icon: null
    }),
    
    computed:{
        
        classe(){
            if ( this.$attrs.el ) {
                return this.$attrs.el.css
            } else {
                return this.$attrs.css
            }
        }
    },
    mounted(){
        if ( this.$attrs.el ) {
            this.icon = this.$attrs.el.content
        } else {
            this.icon = this.$attrs.icon
        }
    }
}
</script>