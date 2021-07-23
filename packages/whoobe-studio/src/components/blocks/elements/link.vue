<template>
    <span @click="action">
        <a v-if="!el.link.includes('#popup?')" :href="link" :target="target">
            <component :is="component" :component="component" :el="el"/>
        </a>
        <component v-if="el.link.includes('#popup?')" :is="component" :component="component" :el="el" @click="prevent"/>
    </span>
</template>
 
<script>
//import MokaText from '@/components/editor/preview/elements/moka.text'
import { mapState } from 'vuex'
export default {
    name: 'MokaLink',
//    components: { MokaText },
    props: [ 'el' , 'child' ],
    data:()=>({
        elementAction: ''
    }),
    computed: {
        ...mapState ( ['moka'] ),
        component(){
            return this.child
        },
        link(){
            if ( this.el.link.includes('#popup?') ){
                this.elementAction = { action:  'popup' , value: this.el.link.split('?')[1] }
                return '#'
                //return '#' + this.el.link.split('?')[1]
            }
            return this.el.link
        },
        target(){
            return this.el.link.includes('http') ? '_blank' : ''
        }
    },
    methods:{
        prevent(e){
            e.preventDefault()
        },
        action(e){
            if ( this.el.link && this.el.link.includes('#popup?') ){
                e.preventDefault()
                console.log ( this.elementAction )
                this.elementAction = { action:  'popup' , value: this.el.link.split('?')[1] }
                if ( this.elementAction ){
                    this.moka.popup ?
                        this.$store.dispatch ( 'popup' , null ) :
                            this.$store.dispatch ( this.elementAction.action , this.elementAction.value )
                } else {
                    return null
                }
            }
        }
    }
}
</script>