<template>
    <client-only>
        <i class="iconify" :class="classe" :data-icon="icon" @click="$emit('click')"/>
    </client-only>
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
    methods:{
        emitClick(){
            this.$emit('click')
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