<template>
    <div class="flex flex-col p-4 bg-gray-200 text-black">
        <label>Name</label>
        <input type="text" v-model="newComponent.name"/>
        <label>Category</label>
        <select v-model="newComponent.category">
            <option v-for="category in $mapState().datastore.dataset.setup[0].categories.components" :value="category">{{ category }}</option>
        </select>
        <label>Description</label>
        <textarea v-model="newComponent.description"/>
        <button @click="saveAsComponent()">Save</button>
    </div>

</template>
<script>
export default {
    name: 'BlockSaveAsComponent',
    data:()=>({
        newComponent: {
            name: '',
            category:'',
            description:''
        }
    }),
    computed: {
        schema(){
            return this.$mapState().datastore.dataset.components[0]
        }
    },
    methods: {
        saveAsComponent(){
            let reusable = this.$mapState().editor.current
            let id = this.$randomID()
            this.newComponent.json = {
                blocks: [ reusable ],
                css: '',
                id: id,
                image: null,
                tag: 'document'
            }
            this.$api.service ( 'components' ).create ( this.newComponent ).then ( res => {
                this.$message ( 'A reusable block has been created' )
                this.$action()
            })
        }
    }
}
</script>