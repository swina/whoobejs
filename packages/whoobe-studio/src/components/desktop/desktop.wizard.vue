<template>
    <div class="theme-dark min-h-screen px-20 pt-8">
        <div class="flex flex-col items-start justify-center m-auto">
            <h3>Website</h3>
            <div class="flex flex-row flex-wrap" v-if="articles">
                <template v-for="article in articles">
                    <div class="flex flex-col items-center justify-start border w-40 h-30 m-4">
                        <div class="truncate ...">{{ article.title }}</div>
                        <img :src="$imageURL(article.template_preview)" class="w-40 h-30 object-cover"/>
                    </div>
                </template>
            </div>
            <h3>Pages : {{ pages }}</h3>
            
                <div>
                    <icon-extra class="text-10xl" icon="zmdi:widgets"/>
                    <button class="lg">Create a block</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeDesktopHome',
    data:()=>({
        articles:[],
        pages:0
    }),
    mounted(){
        this.$api.service ( 'articles' ).find ( {
            query: {
                homepage: true
            }
        }).then ( res => {
            this.articles.push ( res.data[0] )
            console.log ( 'homepage=>',res.data )
        })
        this.$api.service ( 'articles' ).find ( {
            query: {
                store: true
            }
        }).then ( res => {
            this.articles.push ( res.data[0])
            console.log ( 'store=>',res.data )
        })
        this.$api.service ( 'articles' ).find ( {
            query : {
                publish: true,
                homepage: false,
                store: false
            }
        }).then ( res => {
            this.pages = res.total
            this.articles = [ ...this.articles , ...res.data ]
        })
    }
}
</script>