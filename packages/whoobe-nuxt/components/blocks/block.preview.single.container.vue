<template>
    <div 
        :id="doc.hasOwnProperty('anchor')? doc.anchor : doc.id"
        v-if="doc"
        :class="classe(doc.css)" :style="doc.style + ' ' +  background(doc)" :ref="doc.id">
        <template v-for="(block,b) in doc.blocks">

            <block-element
                @click="elementAction"
                v-if="block && !block.hasOwnProperty('blocks') || block.hasOwnProperty('items')"
                :key="block.id"
                :data="$attrs.data||null"
                :currency="$attrs.currency||null"
                :element="block" 
                :develop="false"/>  
            
            <block-preview-single-container
                :key="block.id"
                :data="$attrs.data||null"
                :currency="$attrs.currency||null"
                :component="$attrs.component"
                :top="false"
                :index="b"
                :level="parseInt($attrs.level)+1" 
                v-if="block && block.hasOwnProperty('blocks') && !block.hasOwnProperty('blocks_flip')" 
                :doc="block"/>
            
        </template>     
       
    </div>

</template>

<script>
export default {
    name: 'BlockPreviewSingleContainer',
    components: { 
        'block-element' : () => import ( './block.element.vue' )
    },
    props: [ 'doc' , 'coords' ,'pos' ],
    data:()=>({
        index: 0,
        position: null,
        modal:true
    }),
    computed:{
        zindex(){
            return this.$attrs.level < 1 ? 'auto' : this.$attrs.level < 2 ? 1 : 
                this.$attrs.level //    this.$attrs.zi
        },
        root(){
            return this.$attrs.top ? 0 : parseInt(this.$attrs.level)
        }
        
    },
    methods:{
        elementAction(action){
            this.$emit('action',action)
        },
        
        classe(css){
            return css.hasOwnProperty('css') ? css.css + ' ' + css.container : css
        },
        stile(block,doc){
            if ( !block || !doc ) return 
            let stile = ''
            if ( block.hasOwnProperty('fontFamily')){
                stile += 'font-family:\"' + block.fontFamily + '\"; '
            }
            return block.hasOwnProperty('style') ? block.style + stile : stile
        },
        background(block){
            if ( !block ) return ''
            return block.hasOwnProperty('image') ?
                //'background-image:url(' + this.$imageURL(block.image) + ')' : ''
                block.image && block.image.url ? 
                        ' background-image:url(' + this.$imageURL(block.image) + ');' :
                             ''  : ''
        },
        
        setImageBackground(image){ 
            if ( !image ) return ''
            let response = ' background-image:url(' +  this.$imageURL(image) + ')' //theImg + ');'
            return response
        }
    },

}
</script>