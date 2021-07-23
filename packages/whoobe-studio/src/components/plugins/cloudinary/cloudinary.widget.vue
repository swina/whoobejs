<template>
    <span id="loadCloudinary" class="modal z-highest">
        <!--<button id="upload_widget"  @click="openWidget()">Upload to Cloudinary</button>-->
        <textarea class="opacity-100 h-0 w-0" id="myUpload" @input="emitImage"/>
    </span>
</template>
<script>

  var widget, image
  function injectScript ( params ){
    console.log ( params )
    const pluginScript = document.createElement("script");
    pluginScript.setAttribute("type", "text/javascript");
    pluginScript.setAttribute("charset", "utf-8");
    pluginScript.setAttribute("data-cfasync", "false");
    pluginScript.setAttribute(
        "src",
        `https://widget.cloudinary.com/v2.0/global/all.js`
    );
    let target = document.querySelector('#loadCloudinary')
    target.appendChild(pluginScript);
    let imageUploaded = document.querySelector('#myUpload')
    pluginScript.onload = () => {
        widget = cloudinary.createUploadWidget({
        cloudName:  `${params.cloudName}`, 
        uploadPreset: `${params.uploadPreset}`}, (error, result) => { 
            if (!error && result && result.event === "success") { 
               
                imageUploaded.focus()
                imageUploaded.value =  JSON.stringify(result.info)
                imageUploaded.blur()
                //image = result.info
            } 
        })
        widget.open()
    }
    
  }


export default {
    name: 'PluginCloudinaryWidget',
    data:()=>({
        cloudName : '',
        uploadedImage: ''
    }),
    props: [ 'config' , 'open' ],
    computed:{
      now(){
        return new Date()
      },
      uploaded(){
          console.log ( image )
          this.$action('cloudinary_image')
          this.$store.dispatch('cloudinary_image',image )
          image ? this.$emit('close' , image ) : null
          image = null
          return image
      },
      
    },
    
    methods:{
        emitImage(event){
            /*
            console.log ( event )
            event.target.value ? 
                console.log ( JSON.parse ( event.target.value ) ) : null
            image = null
            */
           return null
            //document.querySelector('#myUpload').value = ''
        },
        openWidget(){
            widget.open()
        }
    },
    mounted(){

        document.querySelector('#myUpload').addEventListener('blur',(el)=>{
            if ( el.target.value ){
                let image = JSON.parse ( el.target.value )
                let newImage = {
                    name: image.original_filename + '.' + image.format,
                    size: image.bytes/1000,
                    width: image.width,
                    height: image.height,
                    url: image.url,
                    ext: image.format,
                    previewUrl : image.thumbnail_url,
                    mime: 'image/' + image.format,
                    formats:null
                }
                this.$api.service ( 'media' ).create ( newImage ).then ( result => {
                    console.log ( result )
                    el.target.value = ''
                    this.$action()
                    this.$store.dispatch('add_media', result )
                })
                //this.$store.dispatch('cloudinary_image' , JSON.parse ( el.target.value ))
                //this.$emit ( 'cloudinary' , JSON.parse(el.target.value) )
                //el.target.value 
           }
           
        })
        injectScript(this.$attrs.plugin.component.config)
    }
} 
</script>
<style>
iframe { z-index:999999999999999999999999999999999999!important }
</style>