<template>
    <div class="flex flex-col p-4">
        <div class="text-sm">
            <button @click="resetFields(),json=null">Reset</button>
            <input type="checkbox" v-model="snipcart"/> <label>Export to Snipcart</label>
        </div>
        <div class="grid" v-if="schema">
            <div class="grid grid-cols-2">
                <label>Export As</label>
                <label>Product Field</label>
            </div>
            <template v-for="(field,index) in schema">
                <div class="grid grid-cols-2">
                    <div>
                        <input type="text" class="dark w-3/4" v-model="mapping[field]"/>
                        <i class="material-icons" @click="disableField(index)">close</i>
                    </div>
                    <div>
                        <span v-if="products[0].hasOwnProperty(field)">{{ field }} </span>
                        <span v-else>
                            <input type="text" v-if="snipcart" v-model="snipcartUrl"/>
                            <input type="text" v-else v-model="mapping[field]"/>
                        </span>
                    </div>
                </div>
            </template>
            <button @click="createJson()">Export</button>

        </div>
        <div v-if="schema && json">
            <div class="flex flex-col p-2">
                <p>You exporting {{ products.length }} products 
                <br>
                </p>
                <vue-blob-json-csv
                    file-type="json"
                    file-name="products"
                    :data="json"
                >
                <button class="my-2 success">Download Products</button>
                Products: {{ products.length }}
                </vue-blob-json-csv>
                
                <!--<button class="warning" @click="importProducts" v-if="!importing">Import Products</button>

                <div v-if="importOK">
                    Imported: {{ importOK.length }}
                    Errors: {{ importError.length }}
                </div>-->
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'MokaProductsExport',
    data:()=>({
        files: [],
        schema: null,
        mapping: {},
        json: null,
        importOK: [],
        importError: [],
        products: null,
        snipcart: false,
        prefix: '',
        snipcartUrl: '/product/$'
    }),
    computed:{
    },
    watch:{
        snipcart(v){
            if ( v ){
                this.prefix = 'data-item-'
                this.schema.push ( 'url' ) 
                this.mapping['url'] = ''
                this.createMapping()
            } else {
                this.prefix = ''
                this.schema.splice(this.schema.indexOf('url'),1)
                delete this.mapping.url
            }
            
        },
        
    },
    mounted(){
        this.$api.service('products').find ( {
            query: {
                $limit : 300
            }
        }).then ( res => {
            this.products = res.data
            let fields = this.products ? Object.keys(this.products[0]) : []
            fields.forEach ( field => {
                this.mapping[field] = this.prefix + field 
            })
            this.schema =  fields
        })
    },
    methods:{ 
        resetFields(){
            let fields = this.products ? Object.keys(this.products[0]) : []
            fields.forEach ( field => {
                this.mapping[field] = this.prefix + field 
            })
            this.schema =  fields
        },
        createMapping(){
             this.schema.forEach ( field => {
                this.mapping[field] = this.prefix + field 
            })
        },
        disableField(index){
            this.schema.splice(index,1)
            this.createMapping()
        },
        setImport ( field , source ){
            this.mapping[field] = source
        },
        createJson(){
            if ( this.products ){
                let exportData = []
                this.products.forEach ( product => {
                    let obj = {}
                    this.schema.forEach ( field => {
                        if ( field === 'url' && this.snipcart ){
                            let url = this.snipcartUrl.split('$')
                            
                            
                            obj[this.mapping[field]] = url[0] + product[url[1]]
                        } else {
                            obj[this.mapping[field]] = product[field]
                        }
                    })
                    exportData.push ( obj )
                })
                console.log ( exportData )
                this.json = exportData
            }
        },
        exportProducts(){
            this.importing = true
            this.importOK = []
            this.importError = []
            this.json.map ( product => {
                let obj = {}
                Object.keys(this.mapping).map ( field => {
                    if ( field.includes('$') ){
                        let url = this.mapping[field].split('$')
                        url = url[0]
                        let target = url[1]
                        obj[field] = url + product[target]
                    } else {
                        obj[field] = product[this.mapping[field]]
                    }
                })
            })
        }
        
    },
}
</script>