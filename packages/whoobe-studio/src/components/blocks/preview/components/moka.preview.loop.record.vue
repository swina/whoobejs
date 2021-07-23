<template>
    <div :class="Object.values(blocks.css).join(' ')" :style="'background-image:url(' + $imageURL(blocks.image)+ ');'">
        <template v-for="block in blocks.blocks">
            <moka-element
                @click="elementAction"
                v-if="block && !block.hasOwnProperty('blocks') || block.hasOwnProperty('items')"
                :key="block.id"
                :el="block"
                :currency="$attrs.currency||null"
                :data="data"
                :develop="false"/>   
            
            <moka-collection-record 
                v-if="block.tag==='container' && !block.hasOwnProperty('blocks_flip')"
                :data="data"
                :currency="$attrs.currency||null"
                :key="$randomID()" 
                :blocks="block"
            />

            <moka-flipbox
                :key="block.id" 
                :ref="block.id" 
                v-if="block && block.hasOwnProperty('image_flip')" 
                :develop="true" 
                :embeded="true" 
                :doc="block" 
                :data="data"
                :currency="$attrs.currency||null"
                :editor="true"/>
        </template>
        
    </div>
</template>

<script>
import MokaContainer from './moka.preview.container'
import MokaElement from './moka.element.component'
import MokaFlipbox from './moka.flipbox'
export default {
    name: 'MokaCollectionRecord',
    components: { MokaContainer , MokaElement , MokaFlipbox },
    props: [ 'blocks' , 'data'],
    methods:{
        elementAction(){
            return null
        }
    }
}
</script>