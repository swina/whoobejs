<template>
    <div class="flex flex-col p-4">
        <label>Name*</label>
        <input class="w-full text-black" type="text" v-model="component.name"/>
        <label>Category</label>
        <select class="w-full text-black" v-model="component.category">
            <option v-for="category in $mapState().datastore.dataset.setup[0].categories.components" :value="category">{{ category }}</option>
            <!-- <option value="component">component</option>
            <option value="widget">widget</option>
            <option value="template">template</option>
            <option value="page">page</option>
            <option value="slider">slider</option>
            <option value="gallery">gallery</option>  -->
        </select>
        <label>Description</label>
        <textarea class="w-full text-black" v-model="component.description"/>
        <button @click="create()">Create</button>
    </div>
</template>

<script>
export default {
    name: 'BlockCreate',
    data:()=>({
        component: {
            name: 'new block',
            description: 'new block by whoobe',
            category : ''
        }
    }),
    methods: {
        create(){
            let component = {
                name: this.component.name,
                description: this.component.description,
                category: this.component.category,
                enabled: true,
                json: {
                    id: this.$randomID(),
                    css: '',
                    image: null,
                    tag: 'document',
                    blocks: []
                }
            }
            this.$api.service ( 'components' ).create ( component ).then ( res => {
                console.log ( res )
                this.$mapState().desktop.tabs.push (
                    {
                        component: 'blocks/editor/block.editor',
                        name: this.component.name,
                        filter: '',
                        mode: 'block',
                        icon: 'edit',
                        blocks: component,
                    }
                )
                this.$mapState().editor.current = component.json
                this.$mapState().editor.component = component
                this.$mapState().desktop.currentTab = this.$mapState().desktop.tabs.length - 1
                window.localStorage.setItem('whoobe-desktop',JSON.stringify(this.$mapState().desktop.tabs))
                this.$action()
            })
        }
    },
    mounted(){
        this.component.category = this.$mapState().datastore.dataset.setup[0].categories.components[0]
    }
}
</script>