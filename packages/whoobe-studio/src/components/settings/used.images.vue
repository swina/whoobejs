<template>
    <div>
        <!-- {{ images.length }} -->
    </div>
</template>

<script>
import jp from 'jsonpath'
export default {
    name: 'WhoobeUsedImages',
    data:()=>({
        images: []
    }),
    mounted(){
        if ( this.$attrs.project.mode != 'single' ){
            this.$api.service('articles').find ( 
                {
                    query : {
                        $limit: 100,
                        $skip:0
                    }
                }
            ).then ( result => {
                console.log ( result )
                let usedFonts = []
                result.data.forEach ( page => {
                    console.log ( page )
                    let json = page.blocks.json
                    let fonts = jp.query ( json , '$..blocks[?(@.style.includes("font-family"))]' )
                    //usedFonts.push ( fonts.style )
                    fonts.forEach ( font => {
                        font.style.includes ( 'font-family') ?
                            usedFonts.push ( font.style.replace('font-family:','').replaceAll('\"','') ) : null
                    })
                    //let fonts = jp.query ( json , '$..blocks..[?(@.style>"font-family"]' )
                    let images = jp.query ( json , '$..blocks..image.url' )
                    images.forEach(img=>
                        !img.includes('http') ?
                            this.images.push(img) : null
                    )
                })
                this.$api.service('products').find ( { query: { $limit: 200 } }).then ( res => {
                    let products_images = res.data.filter ( product => {
                        return product.assets 
                    })
                    console.log ( products_images )
                })

                this.$emit('images',[...new Set(this.images)],[...new Set(usedFonts) ] )
                
            })
        } else {
            console.log ( 'Mode single')
            this.$api.service ( 'components' ).get ( this.$attrs.project.landing ).then ( res => {
                let json = res.json
                let usedFonts = []
                let fonts = jp.query ( json , '$..blocks[?(@.style.includes("font-family"))]' )
                //usedFonts.push ( fonts.style )
                fonts.forEach ( font => {
                    font.style.includes ( 'font-family') ?
                        usedFonts.push ( font.style.replace('font-family:','').replaceAll('\"','') ) : null
                })
                //let fonts = jp.query ( json , '$..blocks..[?(@.style>"font-family"]' )
                let images = jp.query ( json , '$..blocks..image.url' )
                images.forEach(img=>
                    !img.includes('//') ?
                        this.images.push(img) : null
                )
                let classes = jp.query ( json , '$..blocks..css' )
                let purgeClasses = []
                classes.forEach ( classe => {
                    let generalCSS 
                    if ( classe.hasOwnProperty('css') ){
                        console.log ( 'Container => ' , Object.values(classe) )
                        generalCSS = Object.values ( classe ) //classe.css.split(' ')
                        generalCSS.forEach ( css => {
                            if ( css ) purgeClasses.push ( css )
                        })
                        
                        
                    } else {
                        generalCSS = classe.split(' ')
                        generalCSS.forEach ( css => {
                            if ( css ) purgeClasses.push ( css )
                        })
                    }
                })
 
                //console.log ( [...new Set(purgeClasses)] )
                //console.log ( images , fonts )
                this.$emit('images',[...new Set(this.images)],[...new Set(usedFonts) ], [...new Set(purgeClasses)] )
            })
        }
    }
}
</script>