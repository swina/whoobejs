<template>
  <div class="w-1/2">
    <icon name="close" class="top-right m-1" @click="$emit('close')"/>
    <icon :name="theme?'grid_on':'list'" class="top-right m-1 mr-6"/>
    <h3>Media Upload</h3>
    <vue-file-agent 
      :multiple="true"
      :deletable="true"
      @beforedelete="onBeforeDelete($event)"
      :theme="theme?'list':''"
      ref="vueFileAgent" v-model="fileRecords"></vue-file-agent>
    
    <input type="text" v-model="folder" class="dark mr-2" placeholder="target folder"/>
    <button :disabled="!fileRecords.length" @click="uploadFiles()">
    Upload {{ fileRecords.length }} files
    </button>
    <button @click="$emit('close')">Close</button>
    
  </div>
</template>

<script>
export default {

  name: 'MokaMediaUpload',
  data:()=>({
      folder: '',
      selectedFiles: null,
      currentFile: undefined,
      progress: 0,
      message: "",
      fileInfos: [],
      filename: '',
      preview: null,
      uploading: false,
      theme: true,
      fileRecords:[],
      fileRecordsForUpload: [], // maintain an upload queue
      currentFile: null,
      imageURL: '',
      image64: '',
  }),
  mounted(){
    const mediaService = this.$api.service ( 'media ')
    this.folder = this.$attrs.folder
    mediaService.on ( 'created' ,  media => console.log ( 'New image uploaded ' , media ))
  },
  computed:{
    uploadUrl(){
      return process.env.VUE_APP_API_URL + 'upload'
    },
    
  }, 
   methods: {
    selectFile() {
      this.preview = null

      this.previewFile()
      this.selectedFiles = this.$refs.file.files;
    },
    upload() {
      this.progress = 0;

      this.currentFile = this.selectedFiles.item(0);
      console.log( this.currentFile )
      
      this.uploadFile(this.currentFile, event => {
        this.uploading = true
        this.message = 'Uploading ...'
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
        .then(response => {
          this.uploading = false
          this.message = response.data.message;
          this.currenFile = null
          this.selectedFiles = null
          this.preview = null
          this.filename = ''
          this.$emit('uploaded')
          //return UploadService.getFiles();
        })
        .then(files => {
          this.uploading = false
          this.fileInfos = files.data;
        })
        .catch(() => {
          //this.uploading = false
          this.progress = 0;
          this.message = "Could not upload the file!";
          this.currentFile = undefined;
        });

      this.selectedFiles = undefined;
    },
    previewFile() {
      let file = this.$refs.file.files[0];
      this.filename = file.name
      if(!file || file.type.indexOf('image/') === -1) return;
      let reader = new FileReader();

      reader.onload = e => {
        this.preview = e.target.result;
      }

      reader.readAsDataURL(file);
    },
    uploadFiles(){
      this.fileRecordsForUpload = this.fileRecords
      this.fileRecordsForUpload.forEach ( (file,index) => {
        this.uploadFile ( file , file.file , event => {
        this.uploading = true
        this.message = 'Uploading ...'
        this.progress = Math.round((100 * event.loaded) / event.total);
      } , index ).then ( response => {
        this.fileRecordsForUpload.splice(index,1)
        this.$emit('uploaded')
      })
      })
      this.fileRecords = []
    },
    onBeforeDelete: function (fileRecord) {
        var i = this.fileRecordsForUpload.indexOf(fileRecord);
        if (i !== -1) {
        // queued file, not yet uploaded. Just remove from the arrays
          this.fileRecordsForUpload.splice(i, 1);
          var k = this.fileRecords.indexOf(fileRecord);
          if (k !== -1) this.fileRecords.splice(k, 1);
        } else {
          
          this.$refs.vueFileAgent.deleteFileRecord(fileRecord); // will trigger 'delete' event
          
        }
      },
    createBase64Image(obj ,file){
      console.log ( obj.dimensions.width )
      file['dimensions'] = obj.dimensions
      let vm = this
      var reader = new FileReader()
      reader.readAsBinaryString(file)
      reader.onload = () => {
        const newImage = new Promise( (resolve) => {
          resolve(reader.result)
        })
      }
    },
    uploadFile( obj , file, onUploadProgress , index ) {
        let formData = new FormData()
        formData.append("file", file )
        formData.append('folder',this.folder)
        for (var key of formData.entries()) {
			    console.log(key[0] + ', ' + key[1])
        }
        this.createBase64Image ( obj , file )
        
        return this.$http.post('upload/file', 
             formData ,
             {   
                 headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress
            
        })
    }
  }
  
}
</script>