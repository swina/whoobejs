<template>
    <div class="flex flex-col items-center justify-center p-2 rounded">
        <vue-blob-json-csv
            file-type="json"
            :file-name="filename"
            :data="[jsonToExport]">
        <button class="my-2" @click="$action()">Download {{filename}}</button>
        </vue-blob-json-csv>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'WhoobeExportComponent',
    data:()=>({
        filename: 'export'
    }),
    computed:{
        ...mapState ( ['datastore' , 'editor' ,'desktop'] ),
        jsonToExport(){
            if ( this.editor.export === 'single' ){
                this.filename = this.editor.component.name
                return JSON.stringify(this.editor.component) 
            }
            if ( this.editor.export === 'category' ){
                this.filename = this.desktop.tabs[this.desktop.currentTab].name
                return JSON.stringify(this.datastore.dataset.components) 
            }
        }
    }
}
</script>