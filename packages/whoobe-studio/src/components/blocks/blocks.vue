<template>
    <div v-if="blocks" class="w-full">
        <blocks-gallery :objects="blocks" :filter="filter" class="m-auto" @removed="blocksQry()" @duplicated="blocksQry()"/>
    </div>
</template>

<script>
export default {
    name: 'Blocks',
    components: {
        'blocks-gallery'    : () => import ( './blocks.gallery.vue' )
    },
    props: [ 'filter' ],
    data:()=>({
        blocks: null,
        total: 0
    }),
    computed:{
        objects(){
            return this.blocks
        }
    },
    methods:{
        blocksQry(){
            this.$api.service ( 'components' ).find ( {
                query: {
                    $limit: 200,
                    category: this.filter,
                    $sort: { updatedAt: -1 }
                }
            }).then ( res => {
                console.log ( 'Blocks changed!')
                this.total = res.total
                this.blocks = res.data
                this.$store.dispatch ( 'dataset' , { table: 'components' , data: res.data })
            })
        }
    },
    mounted(){
        this.blocksQry()
        this.$api.service ( 'components' ).on ( 'created' , (data) =>{
            this.blocksQry()
            this.$message ( data.name + ' created')
        })
        this.$api.service ( 'components' ).on ( 'removed' , (data) =>{
            this.blocksQry()
            this.$message ( data.name + ' deleted')
        })
    }
}
</script>