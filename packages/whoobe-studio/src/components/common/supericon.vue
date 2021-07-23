<template>
<span :key="id" >
    <component class="iconify" :class="classe" v-if="component" :data-icon="icon" :is="component" :component="component" :data-container-tag="icon" @click="$emit('click')"/>
    
</span>
</template>

<script>
export default {
    name: 'SuperIcon',
    data:()=>({
        id : null,
        component: null
    }),
    watch:{
        icon(v){
            this.component = null
            this.id = this.$randomID()
            console.log ( v )
            if ( this.$attrs.icon ){
                this.component = 'i'
                this.$mapState().editor.current.content = v
            }
        },
        classe(v){
            console.log ( v )
            this.component = null
            this.id = this.$randomID()
            if ( this.$attrs.icon ){
                this.component = 'i'
                this.$mapState().editor.current.content = this.$attrs.icon
            }
        }
    },
    computed:{
        icon(){
            this.component = null
            this.id = this.$randomID()
            this.component = 'i'
            if ( this.$attrs.el ) {
                return this.$attrs.el.content
            } else {
                return this.$attrs.icon
            }
        },
        classe(){
            this.component = null
            this.id = this.$randomID()
            this.component = 'i'
            if ( this.$attrs.el ) {
                return this.$attrs.el.css
            } else {
                return this.$attrs.css
            }
        },
        reload(){
            this.id = this.$randomID()
        }
    }
}
</script>