<template>
    <div class="flex flex-col p-4">
        <!--
        <div class="text-xl">Import Blocks</div>
        <i class="material-icons absolute top-0 right-0 m-1" @click="$emit('close')">close</i>
        -->
        <div v-if="loaded">
            <div v-if="!isLibrary" class="flex flex-col p-2">
                <img :src="json.image_uri" v-if="json.image_uri" class="w-full h-2/5 border mb-2 m-auto object-cover object-top"/>
                <label>Name*</label>
                <input type="text" class="w-full" v-model="json.name"/>
                <label>Category</label>
                <select class="w-full text-black" v-model="json.category">
                    <option value="element">element</option>
                    <option value="component">component</option>
                    <option value="widget">widget</option>
                    <option value="template">template</option>
                    <option value="page">page</option>
                    <option value="slider">slider</option>
                    <option value="gallery">gallery</option> 
                </select>
                <label>Description</label>
                <textarea class="w-full" v-model="json.description"/>
                <button @click="saveImported" class="mt-2 success">Save</button>

            </div>
            <div v-else class="flex flex-col">
                <p>You are importing a library
                <br>
                Blocks : {{ json.length }}
                </p>
                <div class="flex flex-row items-center">
                    <select size="10" class="text-black" v-model="blockIndex">
                        <option v-for="(comp,i) in json" :value="i">
                            {{ comp.category }} - {{ comp.name }}
                        </option>
                    </select>
                    <button @click="json.splice(blockIndex,1)">Remove</button>
                </div>
                
                <button class="warning" @click="importLibrary">Import Library</button>
                <div v-if="loadedComponent">{{loadedComponent}}</div>
            </div>
        </div>
        <div class="flex text-white relative text-center p-2" v-if="!loaded">
            <input type="file" class="absolute top-0 left-0 right-0 bottom-0 opacity-0" @change="loadTextFromFile"/>
            <button class="w-full warning">Select File</button>
        </div>
    </div>
</template>

<script>
export default {
    data:()=>({
        files: [],
        json: null,
        loaded: false,
        loadedComponent:'',
        blockIndex: null
    }),
    computed:{
        isLibrary(){
            return this.json && this.json.length > 1 ? true : false 
        },
    },
    methods:{
        loadTextFromFile(ev) {
            const file = ev.target.files[0];
            const reader = new FileReader();

            reader.onload = e => { 
                //this.json = Object.assign ( {} , JSON.parse(JSON.stringify(e.target.result)) ) //e.target.result //JSON.parse(Object.assign(JSON.parse(e.target.result)))
                this.json = e.target.result //JSON.parse ( JSON.stringify(e.target.result) )
                this.json = JSON.parse(this.json) 
                this.json.map ( (comp,index) => {
                    //comp = JSON.parse(comp)
                    if ( typeof comp === 'string' ){
                        comp = JSON.parse(comp)
                    }
                    //comp.image && comp.image.url ? comp.image_uri = comp.image.url : null
                    //comp.image = null
                    this.json[index] = comp
                })  

                // this.json.length > 1 ?
                //     this.isLibrary = true :
                //         this.isLibrary = false
                
                this.json.length === 1 ?
                    this.json = this.json[0] : null
                this.loaded = true
            }
            reader.readAsText(file)
            
        },
        saveImported(obj){
            let component = this.json
            delete component._id 
            delete component.id
            this.$api.service('components').create ( component ).then ( result => {
                console.log ( result )
                this.$find ( 'components' )
                this.$message('Component uploaded successfully' )
                this.$emit('imported')
                return true
            })
            
            /*
            this.$http.post ( 'components' , this.json ).then ( result => {
                this.$store.dispatch ( 'loadComponents' )
                this.$message('Component uploaded successfully' )
                this.$emit('close')
            }).catch ( error => {
                console.log ( error )
                this.$message('An error occured. Check your console log' )
            })
            */
            //return null
        },
        importLibrary(){
            let n = 1
            console.log ( this.json )
            this.json.forEach ( component => {
                delete component.id
                delete component._id
                this.$api.service('components').create ( component ).then ( result => {
                //this.$http.post ( 'components' , component ).then ( result => {
                    n++
                    this.loadedComponent = component.name
                    if ( n >= this.json.length ){
                        this.$message('Blocks uploaded successfully' )
                        this.$emit('imported')
                        //this.$store.dispatch ( 'loadComponents' )
                        this.loadedComponent = 'Blocks loaded successfully !'
                    }
                }).catch ( error => {
                    console.log ( error )
                    this.$message('An error occured. Check your console log' )
                })
            })
            
        }
        
    }
}
</script>