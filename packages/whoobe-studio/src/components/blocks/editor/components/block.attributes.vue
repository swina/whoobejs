<template>
    <div class="flex flex-col">
        <div v-if="element.attributes && Object.keys(element.attributes).length"  class="flex flex-col mb-20" :key="hasKey()">
            <template v-for="attribute in Object.keys(element.attributes)">
                <div class="flex flex-row w-full justify-between items-center p-2">
                    <div>{{attribute}}</div>
                    <div><input class="dark" type="text" v-model="attributes[attribute]"></div>
                    <icon name="close" @click="deleteAttribute(attribute)"/>
                </div> 
            </template>
            <!-- <select v-model="currentAttribute" class="dark">
                <option v-for="attribute in Object.keys(attributes)" :value="attribute">{{ attribute }}</option>
            </select> -->
            <!-- <input class="dark" type="text" v-model="element.attributes[attribute]">
            <icon name="close" class="ml-4"/> -->
        </div>
        <!-- <template v-for="attribute in Object.keys(attributes)">
            <label>{{ attribute }}</label>
            <input type="text" v-model="attributes[attribute]"/>
        </template> -->
        <div class="flex flex-col p-2">
            <label>New Attribute</label>
            <input type="text" v-model="newAttribute.name"/>
            <label>Value</label>
            <input type="text" v-model="newAttribute.value">
            <button @click="addAttribute()">Add</button>
        </div>
        <!-- <button @click="saveAttributes()" class="success mt-8 m-auto">Save</button> -->
    </div>
</template>

<script>
export default {
    name: 'BlockAttributes',
    data:()=>({
        element: null,
        attributes: {},
        currentAttribute:{},
        newAttribute: {
            name: '',
            value:''
        }
    }),
    methods:{
        addAttribute(){
            this.attributes[this.newAttribute.name] = this.newAttribute.value
            this.element.attributes[this.newAttribute.name] = this.newAttribute.value
            this.currentAttribute = this.newAttribute.name
        },
        deleteAttribute(attribute){
            console.log ( this.element.attributes[attribute] , this.attributes[attribute])
            delete this.attributes[attribute]
            delete this.element.attributes[attribute]
        },
        saveAttributes(){
            this.$store.dispatch ( 'setCurrent' , this.element )
            this.$message('Attributes saved')
        },
        hasKey(){
            return this.$randomID()
        }
    },
    mounted(){
        this.element = this.$mapState().editor.current
        this.element.hasOwnProperty('attributes') ?
            this.attributes = this.element.attributes : this.element.attributes = {}
    }

}
</script>