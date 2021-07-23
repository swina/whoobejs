<template>
<span>
    <component v-if="editor.current && editor.current.id === element.id" :is="tag" :class="$cssResponsive(editor.current.css) + ' relative z-2xtop focus:p-2 cursor-text editor'" contenteditable @blur="handleInput" v-html="editor.current.content" ></component>
    <component v-else :is="tag" :class="$cssResponsive(element.css)" v-html="element.content"></component>
</span>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'MokaInlineEditor',
    data:()=>({
        selection: '',
        start: 0,
        end: 0,
        content:''
    }),
    props: ['element'] ,
    computed: {
        ...mapState ( ['editor'] ),
        tag(){
            return this.element.element === 'h' ? 'h' + this.element.level :
                    this.element.element
        },
    },
  
    methods:{
        openCustomizer(e){
            e.preventDefault();
            this.$action('customize')
        },
        handleInput: function(e){
            let text = e.target.innerHTML.replaceAll(/style=\".*"/gm,'')
            this.editor.current.content = text
        },
    }
}
</script>