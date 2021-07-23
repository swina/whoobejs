<template>
    <div class="relative"> 
        <component 
            :is="component"
            :plugin="plugin"
            :editor="$attrs.editor"/>
        <!-- <block-selector 
            :doc="doc"
            :root="root"
            :component="$attrs.component"
            :zindex="zindex"/>
        <block-floating
            class="z-highest" 
            v-if="doc.id===editor.selected" 
            :doc="doc" 
            @moveup="$emit('moveup',doc.id)"/> -->
    </div>
</template>

<script>
export default {
    data:()=>({
        component: null,
        enabled: false,
    }),
    components: {
        'block-selector'    : () => import ( '@/components/blocks/editor/components/block.container.selector.vue' ),
        'block-floating'    : () => import ( '@/components/blocks/editor/components/block.floating.bar.vue' ),
    },
    props: ['doc','plugin'],
    computed:{
    },
    mounted(){
        let name = this.plugin.general.path 
        //if ( this.$attrs.editor ) name += '.editor'
        //console.log ( '@/components/plugins/' + name + '.vue' )
        this.component = () =>  import(/* webpackChunkName: 'whoobe_' */ '@/components/plugins/' + name )
    }
}
</script>