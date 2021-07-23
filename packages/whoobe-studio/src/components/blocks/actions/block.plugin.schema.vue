<template>
    <div class="theme-dark p-2" v-if="schema">
        <div class="bg-gray-200 flex flex-col p-2 text-black">
            Elements for {{ this.$mapState().editor.schema }}
            <div class="grid grid-cols-5">
            <select size="10" class="w-64 col-span-2" v-model="field" @dblclick="addField(field)">
                <option v-for="field in Object.keys(schema)" :value="field">{{ field }}</option>
            </select>
            <div class="flex flex-col items-center justify-center">
                <button @click="addField(field)">Add</button>
            </div>
            <!-- <select size="10" class="w-64 col-span-2" v-model="fieldSelected">
                <option v-for="field in Object.keys(selected)" :value="field">{{ field }}</option>
            </select> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BlockActionPluginSchema',
    data:()=>({
        container: null,
        current: null,
        field: null,
        schema: null,
        selected:{},
        fieldSelected: null
    }),
    methods:{
        addField ( field ){
            console.log ( this.schema[field].type )
            let element
            if ( this.schema[field].type === 'string' || this.schema[field].type === 'text' ){
                element = {"css":"","style":"","label":"Text","content":"inline text","icon":"text_snippet","type":"element","tag":"element","link":"","element":"div"} 
                
            }
            if ( this.schema[field].type === 'currency' ){
                element = {"css":"","style":"","label":"Currency","content":"$","icon":"money","type":"element","precision":2,"tag":"element","link":"","element":"span"}
            }
            if ( this.schema[field].type === 'image' ){
                element = {"css":"","style":"","label":"Image","content":"","icon":"insert_photo","type":"image","tag":"element","link":"","id":"moka-v2i8y","image":null,"element":"img"}
            }
            
            element.id = this.$randomID()
            element.content = '[' + this.$mapState().editor.schema + ']' + field
            element.data = {
                dataset: this.$mapState().editor.schema,
                field: field
            }
            this.container.blocks.push ( element )
        }
    },
    mounted(){
        this.container = {"css":{"css":"","container":"flex"},"loop":false,"blocks":[],"semantic":"","style":"","label":"Flexbox","content":"","icon":"highlight_alt","rows":[],"type":"flex","tag":"container","link":"","image":null,"element":"div" }
        this.container.id = this.$randomID()
        this.container.data = {
            dataset: this.$mapState().editor.source ? this.$mapState().editor.source : this.$mapState().editor.schema,
            id: null
        }
        this.$mapState().editor.current.blocks.push ( this.container )
        this.current = this.$mapState().editor.current
        this.schema = this.$mapState().datastore.schema[this.$mapState().editor.schema]
        
    }
}
</script>