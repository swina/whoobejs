<template>
<div v-if="articles">
    Articles : {{ articles.length }}
    <div class="flex flex-row flex-wrap justify-around p-4">
        <template v-for="(article,index) in articles">
            <div class="flex flex-col m-2 cursor-pointer" v-if="index >= start && index <= (start+limit)" @click="$emit('selected',article)">
                <div class="text-xs" :class="article.publish?'text-lime-500':'text-red-500'">
                    {{ article.title.substring(0,20) }}
                </div>
                <img :src="$imageURL(article.template_preview)" v-if="article.template_preview" class="w-32 h-40 object-cover object-top"/>
                <div v-if="!article.template_preview" class="border w-32 h-40 flex items-center justify-center">
                    No preview
                </div>
            </div>
        </template>
    </div>
    <div class="flex flex-row justify-around text-center">
        <i class="material-icons mx-2 text-2xl" @click="start > 0 ? start -= limit : null">chevron_left</i>
        <i class="material-icons mx-2 text-2xl" @click="(start+limit)<articles.length ?start += limit :null">chevron_right</i>
    </div>
</div>
</template>

<script>
export default {
    name: 'WhoobeArticleSelector',
    data:()=>({
        articles: null,
        start: 0,
        limit: 10
    }),
    mounted(){
        this.articles = this.$mapState().datastore.dataset.articles.sort ( (a,b) => a.title - b.title )
    }
}
</script>