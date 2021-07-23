<template>
    <div 
        v-if="blocks"
        :class="'relative '  + blocks.css.css + ' ' + blocks.css.container"
        :style="blocks.style + ' ' + background(blocks)">
        <div 
            :key="flex.id"
            v-for="(flex,f) in blocks.blocks" 
            :class="'relative ' + Object.values(flex.css).join('')"
            :style="flex.style + ' ' + background(flex)">

            <template v-for="(el,i) in flex.blocks">
               
                <moka-element  
                    v-if="el.type != 'flex'"
                    :key="el.id"
                    :element="el" 
                    :coords="$attrs.coords"
                    :develop="$attrs.develop"/>

                <div v-if="el.type==='flex'" :class="el.css.css + ' relative ' + el.css.container" :style="el.style">
                    <moka-element  
                        v-if="element.type != 'flex' && element.type != 'grid'"
                        v-for="(element,e) in el.blocks"
                        :key="element.id"
                        :element="element" 
                        :coords="$attrs.coords"
                        :develop="$attrs.develop"/>

                </div>
            </template>
            <!--    
            <moka-element  
                :key="el.id"
                :element="el" 
                :coords="$attrs.coords"

                v-for="el in flex.blocks"
                :develop="$attrs.develop"/>
            -->

        </div>
    </div>
</template>

<script>
import MokaElement from './moka.element'
import { mapState } from 'vuex'
export default {
    components:{ MokaElement },
    computed: {
        ...mapState ( ['moka'] )
    },
    props: ['blocks'],
    methods:{
        background(block){
            return block.hasOwnProperty('image') ?
                block.image && block.image.url ? 
                    block.image.previewUrl ? 
                        ' background-image:url(' + block.image.previewUrl + ');background-size:cover;background-repeat:no-repeat;' :
                            ' background-image:url(' + block.image.url + ');' : ''  : ''        
        },
        active(id){
            if ( this.moka && this.moka.selected ) {
                return this.moka.selected === id ? 'opacity-100' : 'opacity-0 hover:opacity-100'
            } else {
                return 'opacity-0 hover:opacity-100 '
            }
        },
        setCurrent(arr,element){
            let coords = this.$attrs.coords
            if ( arr ){
                arr.forEach ( a => {
                    coords.push ( a )
                })
            }
            this.$emit('selected',coords,element)
        }
    }
}
</script>