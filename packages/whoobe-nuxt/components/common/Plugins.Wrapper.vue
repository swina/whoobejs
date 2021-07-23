<template>
    <div class="relative">
        <component :is="component"
            :config="$attrs.component.config" :settings="$attrs.settings" :plugin="$attrs.plugin" :block="$attrs.block" :el="$attrs.plugin"/>
    </div>
</template>

<script>
export default {
    data:()=>({
        component: null,
        enabled: false,
    }),
    computed:{
    },
    mounted(){
            let name = this.$attrs.component.path 
            this.component = () =>  import(/* webpackChunkName: 'whoobe_' */ '@/components/plugins/' + name )
    }
}
</script>