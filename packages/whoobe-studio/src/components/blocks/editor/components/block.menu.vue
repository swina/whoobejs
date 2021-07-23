<template>
    <div :class="element.css.css + ' '  + element.css.container +  ' ' + element.css.align">
        <template v-for="item in element.items">
            <block-element
                :key="item.label"
                :element="el(item)"
                :class="element.css.menu_item"
                :id="$randomID()"
                :develop="true"
                :level="parseInt($attrs.level)+1"/>
                <!-- @selected="setCurrent(el(item)),$store.dispatch('setCurrent',el(item)),$store.dispatch('selected',el(item).id)"
                @customize="customize"
                @copy="$emit('copy')"
                @animation="$emit('animations')"
                @delete="$emit('delete')" 
                @editinline="setCurrent(block),edit" -->

        </template>
    </div>
</template>

<script>
export default {
    name: 'BlockEditorMenu',
    components: {
        'block-element' : () => import ( './block.element' )
    },
    props:['element'],
    methods: {
        el(item){
            let obj = {
                "css": this.element.css.menu_item,
                "style":"",
                "content":item.label,
                "icon":"text_format",
                "type":"element",
                "tag":"element",
                "link":item.link,
                "element":"span",
                "id":this.$randomID()
            }
            return obj
        }
    }
}
</script>