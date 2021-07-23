<template>
    <div> 
    <moka-loop-pagination 
            v-if="doc.pagination" 
            :start="start" 
            :limit="limit" 
            :total="total" 
            :doc="doc"
            @prev="start=start-limit" 
            @next="start=start+limit"/>

    <div v-if="apiID" :class="Object.values(doc.css).join(' ')">
        <template v-for="(item,i) in dataset">
            <moka-loop-record
                :key="item.id"
                :currency="doc.currency||null"
                v-if="i>=start && i<(start+limit)"
                :blocks="doc.blocks[0]"
                :data="item"/>
        </template>
    </div>

       <moka-loop-pagination 
            v-if="doc.pagination" 
            :start="start" 
            :limit="limit" 
            :total="total" 
            :doc="doc"
            @prev="start=start-limit" 
            @next="start=start+limit"/>
    </div>
</template>

<script>
import MokaLoopRecord from './moka.preview.loop.record'
import MokaLoopPagination from './moka.preview.loop.pagination'
export default {
    name: 'MokaCollectionLoop',
    components: { MokaLoopRecord , MokaLoopPagination },
    data:()=>({
        apiID: '',
        dataset: null,
        start: 0,
        limit: 8,
        total: 0,
        pagination: false,
    }),
    props: ['doc'],
    mounted(){
        this.limit = parseInt(this.doc.records)
        this.pagination = this.doc.pagination
        this.$http.get ( 'content-type-builder/content-types' ).then ( res => {
            console.log ( res )
            const apiID = res.data.data.filter ( ct => {
                return ct.schema.name === this.doc.collection
            })
            
            this.apiID = apiID[0]
            this.$http.get ( this.apiID.schema.collectionName ).then ( res => {
                this.dataset = res.data
                this.total = this.dataset.length
            })
        })
    }

}
</script>