<template>
    <div :data="printNow">
        
    </div>
</template>
<script>
export default {
    data:()=>({
        printed: false
    }),
    props:['print'],
    computed:{
        printNow(){
            this.saveprint()
        },
        devMode(){
             if ( typeof webpackHotUpdate === 'undefined' ) {
                 
                 return true //false
             }
             
             return true
        },
    },
    methods:{
        //save screenshot of blocks
        save(screenshot){
            if ( screenshot ){
                this.$mapState().editor.component.image_uri = screenshot.replace('.jpg','.webp')
                this.$mapState().editor.component.image = screenshot.replace('.jpg','.webp')
                    //!screenshot.url.includes('http') ? 
                        //process.env.VUE_APP_API_URL + screenshot.url.replace('/','') : 
                            //screenshot.url
            }
            //window.localStorage.setItem ( 'whoobe-image-url' , this.$imageURL ( screenshot ) )
            //this.$action('filerobot')
            this.$action('savecomponent')
            this.$emit('printed')
        },
        //screenshot print
        saveprint(){
            if ( !this.devMode ){
                this.$message('This option is available only in development mode')
                return
            }
            this.$loading(true)
            this.printMe()
        },
        //print action
        async printMe(block='content') {
            
            if ( !this.devMode ){
                this.$message('This option is available only in development mode')
                return
            }
            let el , options
            el = document.querySelector('#' + block)
            if (!el){
                document.querySelector(block)
            }
            options = { type: "dataURL" , useCORS: true , scale: 0.50 }
            let screenshot = await this.$html2canvas(el, options)
            
            this.srcToFile ( screenshot ,  'preview_' + this.$mapState().editor.component.name.replaceAll(' ','_') + '.jpg' , 'image/jpg' ).then ( resp => { 
                //console.log ( 'src to file => ' , resp )
                let formData = new FormData()

                formData.append("file", resp )
                formData.append("folder","preview")
                formData.append('thumbs',0)
                formData.append('url','/uploads/preview/preview_' + this.$mapState().editor.component.name.replaceAll(' ','_') + '.jpg')
                this.$http.post("upload/file", 
                    formData ,
                    {   
                        headers: {
                            "Content-Type": "multipart/form-data"
                        },
                }).then ( response => {
                    console.log ( response )
                    screenshot = response.data.url
                    this.save(screenshot)
                    this.$loading()
                    return screenshot
                }).catch ( error => {
                    this.$loading()
                    this.$message ( 'An error occured. Check your console log')
                    //console.log ( error )
                })
            })

        }, 
        async srcToFile(src, fileName, mimeType){
            return (fetch(src)
                .then(function(res){return res.arrayBuffer();})
                .then(function(buf){return new File([buf], fileName, {type:mimeType});})
            );
        },
    }
}
</script>