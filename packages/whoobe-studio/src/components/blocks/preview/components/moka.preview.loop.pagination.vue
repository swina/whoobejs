<template>
    <div :class="'w-full p-4 cursor-pointer ' + classe">
        <i class="mr-4 bi-chevron-left" @click="$attrs.start > 0 ? $emit('prev') : null"></i>
        <small>{{ page }}</small>
        <i class="ml-4 bi-chevron-right" @click="activeNext ? $emit('next') : null" v-if=""></i>
    </div>
</template>

<script>
export default {
    name: 'MokaPreviewLooopPagination',
    props:['doc'],
    computed:{
        classe(){
            let css = ''
            this.doc.hasOwnProperty('pagination_color') ?
                css += ' ' + this.doc.pagination_color : null
            this.doc.hasOwnProperty('pagination_justify') ?
                css += ' ' + this.doc.pagination_justify : null
            return css
        },
        activeNext(){
            return (parseInt(this.$attrs.start)+parseInt(this.$attrs.limit))<=parseInt(this.$attrs.total) ? true : false
        },
        page(){
            let pg = (parseInt(this.$attrs.start)+1) + '-'
                    parseInt(this.$attrs.start)+parseInt(this.$attrs.limit) > parseInt(this.$attrs.total) ?
                            pg += this.$attrs.total :
                                pg += parseInt(this.$attrs.start)+parseInt(this.$attrs.limit)
            return pg
        }
    }
}
</script>