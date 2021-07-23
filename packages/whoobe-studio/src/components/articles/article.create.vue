<template>
    <div class="flex flex-col p-4">
        <label>Title</label>
        <input class="dark w-full" type="text" v-model="newArticle.title"/>
        <label>Category</label>
        <select class="dark" v-model="newArticle.category">
            <option value=""></option>
            <option v-for="(category,c) in $mapState().datastore.dataset.setup[0].categories.articles" :value="category"> {{ category }} </option>
        </select>
        <div class="mt-8 flex items-center">
            <button class="lg m-auto" @click="create">Create</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ArticleCreate',
    data:()=>({
        newArticle: {
            title: '',
            category: ''
        },
    }),
    methods:{
        create(){
            this.newArticle.blocks = []
            this.$api.service('articles').create ( this.newArticle ).then ( res => {
                this.$mapState().desktop.tabs.forEach ( (tab,index) => {
                    if ( tab.name === 'Articles' ){
                        this.$mapState().desktop.currentTab = index
                        this.$action()
                        return
                    }
                })
                this.$mapState().desktop.tabs.push (
                    {
                        component: 'articles/articles',
                        name: 'Articles',
                        filter: '',
                        mode: 'article',
                        icon: 'article',
                        blocks: null
                    }
                )
                this.$action()
            })
        }
    }
}
</script>