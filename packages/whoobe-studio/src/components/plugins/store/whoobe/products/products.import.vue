<template>
    <div class="flex flex-col p-4 bg-white text-black">
        <div class="grid" v-if="schema && importFields">
            <template v-for="field in Object.keys(schema)">
                <div class="grid grid-cols-2" v-if="schema[field].import">
                    <div>{{ field }}</div>
                    <div v-if="importFields">
                        <select @change="setImport(field,$event.target.value)">
                            <option value="">no import</option>
                            <option v-for="sfield in importFields" :value="sfield" :selected="field===sfield.toLowerCase()?true:false">{{sfield}}</option>
                        </select>

                    </div>
                </div>

            </template>

        </div>
        <div v-if="schema && importFields">
            <div class="flex flex-col p-2">
                <!-- <p>You are importing {{ json.length }} products 
                <br>
                </p> -->
                Limit 
                <select v-model="importLimit">
                    <option value="10">First 10 records</option>
                    <option value="100">First 100 records</option>
                </select>
                <input type="number" min="1" max="10000" v-model="importLimit"/>
                Skip
                <input type="number" min="0" v-model="importSkip"/>
                Create new database
                <input type="text" v-model="importNamespace"/>
                <button class="warning" @click="importProducts">Import Products</button>

                <div v-if="importOK">
                    Imported: {{ importOK.length }}
                    Errors: {{ importError.length }}
                    <div v-for="error in importError" class="flex flex-col">
                        <div>{{ error }}</div>
                    </div>
                </div>
                <!--<div v-if="loadedComponent">{{loadedComponent}}</div>-->
            </div>
        </div>
        <div class="flex text-white relative text-center p-2">
            <input type="file" class="absolute top-0 left-0 right-0 bottom-0 " @change="loadTextFromFile"/>
            <!-- <button class="hidden w-full warning">Select File</button> -->
        </div>
    </div>
</template>

<script>
import model from '../model.js'
import jp from 'jsonpath'

export default {
    name: 'WhoobeStoreImport',
    data:()=>({
        files: [],
        json: null,
        loaded: false,
        loadedComponent:'',
        blockIndex: null,
        schema: null,
        toImport: null,
        importFields: null,
        importLimit: null,
        importSkip:0,
        mapping: {},
        importOK: [],
        importError: [],
        importNamespace: '',
        categories:[],
        facets:[],
        products: null,
        variations: null
    }),
    computed:{
        productCategories(){
            return [ ...new Set(this.categories) ].filter(c=>c.length>1)
        },
        productFacets(){
            return [ ...new Set(this.facets) ].filter ( f => f.length > 1)
        }
    },
    watch:{
        json(v){
            if ( v.length ){
                this.importFields = Object.keys ( v[0] )
                this.importFields.forEach ( field => {
                    if ( Object.keys(this.schema).includes ( field ) ){
                        this.mapping[field] = field
                    }
                }) 
            }
        }
    },
    mounted(){
        this.schema = model
    },
    methods:{ 
        setImport ( field , source ){

            this.mapping[field] = source
        },
        loadTextFromFile(ev) {
            this.importing = false
            const file = ev.target.files[0];
            const reader = new FileReader();
            let vm = this
            reader.onload = e => { 
                //this.json = Object.assign ( {} , JSON.parse(JSON.stringify(e.target.result)) ) //e.target.result //JSON.parse(Object.assign(JSON.parse(e.target.result)))
                this.json = vm.csv_to_json(e.target.result) //JSON.parse ( JSON.stringify(e.target.result) )
                //this.json = JSON.parse(JSON.stringify(this.json)) 
            }
            reader.readAsText(file)
            
        },
        importProducts(){
            this.importing = true
            this.importOK = []
            this.importError = []
            let start = parseInt(this.importSkip)
            let max = start + parseInt(this.importLimit)
            for ( var n = start ; n < max ; n++ ){
                let importProduct = {}
                Object.keys(this.mapping).forEach( field => {
                    if ( field != 'category' ){
                        importProduct[field] = this.products[n][this.mapping[field]]
                    }
                })
                let cat = this.products[n].category
                let facet = []
                if ( cat.includes ( '|' ) ){
                    cat = this.products[n].category.split('|')[0]
                } 
                if ( cat.includes ( '>' ) ){
                    cat = this.products[n].category.split('>')[0]
                    facet = this.products[n].category.split('>')[1].split('|')
                }
                importProduct.category = cat
                importProduct.facets = facet
                
                if ( this.products[n].type === 'simple' || this.products[n].type === 'variable' ){
                    importProduct.type = 'product'
                    importProduct.parent = ''                    
                }

                if ( this.products[n].type === 'variable' ){
                    console.log ( this.variations.filter ( variation => variation.parent_id === this.products[n].id_import))
                }
                //         let variations = this.products.filter ( product => product.parent_id === product.id_import )
                //         console.log ( "variations=>" , variations )
                //     }
                // }
                if ( this.products[n].parent_id != '0' ){
                    importProduct.type = 'variation'
                    importProduct.parent = this.products[n].parent_id
                }
                importProduct.price_value = parseFloat(importProduct.price)
                importProduct.active = true
                this.$api.service ( 'products' ).create ( importProduct ).then ( res => {
                    console.log ( 'Added => ' , res )
                    this.importOK.push( importProduct.sku )
                }).catch ( error => {
                    console.log ( error )
                    this.importError.push ( importProduct.sku )
                })
            }
            // this.json.map ( product => {
            //     if ( product.name ){
            //         product.type = "product"
            //     } else {
            //         product.type = "variation"
            //     }
            //     if ( product.assets ){
            //         product.assets = '/uploads/' + product.assets
            //     }
            //     this.$api.service( 'products' ).create ( product ).then ( res => {
            //         this.importOK.push( product.sku )
            //     }).catch ( error => {
            //         this.importError.push ( produc.sku )
            //     })
            // })
        },
        csv_to_json(csvData) {
            var data = this.CSVToArray(csvData);
            var objData = [];
            for (var i = 1; i < data.length; i++) {
                objData[i - 1] = {};
                for (var k = 0; k < data[0].length && k < data[i].length; k++) {
                    var key = data[0][k].trimEnd()
                    objData[i - 1][key] = data[i][k].trimEnd().replaceAll('category:','')
                }
            }
            this.importFields = Object.keys ( objData[0] )
            
            this.products = objData.filter ( product => product['parent_id'] === '0' )
            this.variations = objData.filter ( product => product['parent_id'] != '0' )
            console.log ( 'Total=>'  , this.products.length )
            console.log ( objData )
            // let cats = [ ...new Set(objData.map ( prod => prod['category'] )) ]
            // console.log ( cats )
            // this.categories = []
            // this.facets = []
            // console.log ( cats )
            // cats.map ( c => {
            //     let cat = c
            //     let parent = this.$randomID()
            //     let fc = ''
            //     if ( c.includes ( '|' ) ) {
            //         cat = c.split('|')[0]
            //     }
            //     let category = cat
                
            //     if ( cat.includes ( '>' ) ){
            //         category = cat.split('>')[0]
            //         fc = cat.split('>')[1] 
            //         this.facets.push ( fc )
            //         // this.facets.push ( {
            //         //     collection : parent,
            //         //     name: fc,
            //         //     slug: this.$slugify(fc),
            //         //     type: 'facet',
            //         //     active: true
            //         // })
            //         console.log ( 'Facet=>' , fc )
            //     }
            //     console.log ( 'Category=>' , category )
            //     this.categories.push ( category )

            // })
            return objData
        },
        CSVToArray(csvData, delimiter) {
            delimiter = (delimiter || ",");
            var pattern = new RegExp((
            "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            "([^\"\\" + delimiter + "\\r\\n]*))"), "gi");
            var data = [[]];
            var matches = null;
            while (matches = pattern.exec(csvData)) {
                var matchedDelimiter = matches[1];
                if (matchedDelimiter.length && (matchedDelimiter != delimiter)) {
                    data.push([]);
                }
                if (matches[2]) {
                    var matchedDelimiter = matches[2].replace(
                    new RegExp("\"\"", "g"), "\"");
                } else {
                    var matchedDelimiter = matches[3];
                }
                data[data.length - 1].push(matchedDelimiter);
            }
            return (data);
        }
        /*
        saveImported(){
            this.$http.post ( 'components' , this.json ).then ( result => {
                this.$store.dispatch ( 'loadComponents' )
                this.$message('Component uploaded successfully' )
                this.$emit('close')
            }).catch ( error => {
                console.log ( error )
                this.$message('An error occured. Check your console log' )
            })
            return null
        },
        importLibrary(){
            let n = 1
            this.json.forEach ( component => {
                this.$http.post ( 'components' , component ).then ( result => {
                    console.log ( result )
                    n++
                    this.loadedComponent = component.name
                    if ( n >= this.json.length ){
                        this.$store.dispatch ( 'loadComponents' )
                        this.$message('Blocks uploaded successfully' )
                        this.loadedComponent = 'Blocks loaded successfully !'
                    }
                }).catch ( error => {
                    console.log ( error )
                    this.$message('An error occured. Check your console log' )
                })
            })
            
        }
        */
        
    }
}
</script>