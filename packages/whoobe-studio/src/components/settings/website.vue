<template>
    
        <!-- <div class="flex flex-col items-center">
            <div class="w-full bg-gray-900 p-1 text-xl">{{ website.title }}</div>
            <div>Template: {{ website.blocks.name }}</div>
            <img v-if="website.template_preview" :src="$imageURL(website.template_preview)" class="m-2 w-32 h-48 object-cover object-top"/>
        </div>
        <div class="col-span-3">
        <div class="w-full bg-gray-900 p-1 text-xl">Pages</div> -->
        <div v-if="pagesPreview" class="grid grid-cols-3 gap-5">
            <template v-for="preview in pagesPreview">
                <div class="flex flex-col m-2 mx-4 justify-center items-center border border-gray-900 cursor-pointer" :title="preview.title + ' [' + preview.category + ']'" @click="setPreview(preview)">
                    {{ preview.title.substring(0,20) }}
                    <img v-if="preview.image" :src="$imageURL(preview.image)" class="w-full h-40 object-cover object-top"/>
                    <icon v-if="!preview.image" name="view_quilt" class="text-8xl m-auto"/>
                </div>
            </template>
        </div>
        
</template>

<script>
export default {
    name: 'WhoobeWebsitePages',
    data:()=>({
        //website: null,
        allPagesLinks : null,
        pagesPreview: []
    }),
    props: [ 'slugs' ],
    computed:{
        pages(){
            return [ ...new Set(this.allPagesLinks) ].filter ( url => url.length > 0).map( slug => slug.replace('/',''))
        },
        
    },
    watch:{
        slugs(val){
            this.pagesPreview = []
            if ( val ){
                val.forEach ( url => {
                    this.pagePreview ( url )
                })
            }
        }
    },
    methods:{
        pagePreview(page){
            this.$api.service ( 'articles' ).find ( { query: { slug: page } } )
                .then ( res => {
                    if ( res && res.data && res.data.length ){
                        console.log ( res.data[0].template_preview )
                        this.pagesPreview.push ( { id: res.data[0]._id , image: res.data[0].template_preview , title: res.data[0].title , category: res.data[0].categories } )
                    }
                })
        },
        setPreview ( article ){
            this.$api.service ( 'articles' ).get ( article.id ).then ( res => {
                window.localStorage.setItem('whoobe-article',JSON.stringify(res))
                window.localStorage.setItem('whoobe-preview',JSON.stringify(res.blocks.json))
                let route = this.$router.resolve({path: '/preview?mode=article'});
                let w = window.open(route.href, 'whoobe','width=' + window.screen.availWidth );
                w.focus()
                //window.open ( 'preview?mode=article', 'whoobe' )
            })
        }
        // async searchLinks(){
        //     console.clear()
        //     await this.website.blocks.links.forEach ( url => {
        //         console.log ( 'URL=>', url )
        //         this.$pageLinks(url).then ( res => {
        //             let id = res.data[0]._id
        //             this.$api.service('articles').patch ( id , { publish: true } )
        //             let dataLinks = [ ...new Set(res.data[0].blocks.links) ] 
        //             this.pagePreview ( url.replace('/','' ) )
        //             return dataLinks
        //         }).then ( data => {
        //            this.allPagesLinks = [ ...new Set(this.allPagesLinks) , ...data ]
        //         })
        //     })
            
        // },
    },
    mounted(){
        this.pagesPreview = []
        if ( this.slugs ) {
            this.slugs.forEach ( url => {
                this.pagePreview ( url )
            })
        }
        // this.$api.service('build-nuxt').find().then ( res => {
        //     if ( res.data ){
        //         this.website = res.data[0]
        //         this.allPagesLinks = this.website.pagesToPublish
        //         this.website.pagesToPublish.forEach( url => {
        //             this.pagePreview ( url )
        //         })
        //         //this.searchLinks()
        //     } else {
        //         this.$api.service ( 'articles' ).find ( { query: { homepage: true }}).then ( res => {
        //             console.log ( res )
        //             if ( res.data ){
        //                 this.website = res.data[0]
        //                 this.searchLinks()
        //             } else {
        //                 this.$message ( 'No website defined yet. You have to set an article as homepage')
        //             }
        //         })
        //     }
        // })

    }
}
</script>