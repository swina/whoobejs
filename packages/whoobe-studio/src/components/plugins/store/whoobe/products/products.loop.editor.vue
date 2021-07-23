<template>
    <div>
        <editor :blocks="doc"/>
    </div>
</template>

<script>
import model from '../model.js'
export default {
    name: 'WhoobeStorePluginLoopDesigner',
    components:{
        'editor' : () => import ( '@/components/blocks/editor/block.editor.vue' )
    },
    data:()=>({
        model: null,
        doc:{
            name: 'Whoobe Store Products Loop',
            category: 'template',
            json:{
                blocks: [],
                css: '',
                image: null,
                tag: 'document'
            }
        }
    }),
    methods:{
        initTemplates(){
            let singleTemplate = this.doc
            singleTemplate.name = 'Whoobe Store Single Product'
            this.$attrs.plugin.templates = { loop: this.doc , single: singleTemplate }
            this.$api.service ( 'plugins' ).patch ( this.$attrs.plugin._id , this.$attrs.plugin ).then ( res => {
                console.log ( res )
            })
        }
    },
    mounted(){
        this.model = model
        this.$attrs.plugin.hasOwnProperty('templates') ?
            this.doc = this.$attrs.plugin.templates.loop : this.initTemplates()
    }
}
</script>