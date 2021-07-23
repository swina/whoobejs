<template>
    <div
        :key="$randomID()"
        :id="doc && doc.hasOwnProperty('anchor')? doc.anchor : doc.id"
        v-if="doc"
        :class="classe(doc.css)" :style="doc.style + ' ' +  background(doc)" :ref="doc.id">
        <template v-for="(block,b) in doc.blocks">
             
            <block-element
                v-if="block && !block.hasOwnProperty('blocks') || block.hasOwnProperty('items')"
                :key="block.id"
                :el="block"
                :element="block" 
                :develop="false"/> 
            

            <block-preview-container
                v-if="block && block.hasOwnProperty('blocks') && !block.hasOwnProperty('blocks_flip')" :doc="block" :key="block.id"/>
            
        </template>
        
    </div>

</template>
<script>
export default {
    name: 'BlockSlidesContainer',
    components: {
        'block-preview-container' : () => import ( '@/components/blocks/preview/components/moka.preview.container.vue' )
    },
    props:['doc'],
    methods:{
        classe(){
            return ''
        },
        background(){
            return ''
        }

    }
}
</script>