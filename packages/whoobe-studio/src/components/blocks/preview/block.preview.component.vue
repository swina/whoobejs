<template>
    <div :class="doc.css.css + ' ' +  doc.css.container" class="bg-white flex flex-col" :style="background(doc)">
        <template v-for="block in doc.blocks">
            <preview :doc="block" :key="block.id" v-if="(block.type==='grid' || block.type==='flex' ) && block.type!='slides'"/>

            <block-slides v-if="block.type==='slides'" :doc="block" :key="block.id"/>
        </template>
    </div>
</template>

<script>
export default {
    name:'Preview',
    components: {
        'block-slides'  : () => import ( '@/components/plugins/slides/slides.vue' )
    },
    props:['doc'],
    methods: {
        background(block){
            return block.hasOwnProperty('image') ?
                block.image ?
                    ' background-image:url(' + this.$imageURL(block.image) + ');' : '' : ''
        }
    }
}
</script>