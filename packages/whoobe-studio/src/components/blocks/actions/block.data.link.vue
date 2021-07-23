<template>
    <div class="p-2">
        Select an item
        <select v-model="selected" class="text-black">
            <option value="auto">--- auto ---</option>
            <option v-for="item in data" :value="item._id">{{ item.name }}</option>
        </select>
        
    </div>
</template>
<script>
import jp from 'jsonpath'
export default {
    name: 'BlockDataLink',
    data:()=>({
        data: null,
        itemLink : null,
        selected: null,
        schema: null
    }),
    watch:{
        selected ( id ){
            let children = jp.query ( this.$mapState().editor.current  , '$..blocks..data' )
            if ( id && id !='auto'){
                
                this.$api.service ( this.$mapState().editor.current.data.dataset ).get ( id ).then ( res => {
                    this.itemLink = res
                    this.$mapState().editor.current.data.link = res
                    //let children = jp.query ( this.$mapState().editor.current  , '$..blocks..data' )
                    children.forEach ( child => {
                        if ( this.schema[child.field].type === 'image' ){
                            child.image = res[child.field]
                        } else {
                            child.content = res[child.field]
                        }

                    })
                    this.$action()
                })
            } else {
                this.$mapState().editor.current.data.link = null
                children.forEach ( child => {
                    if ( this.schema[child.field].type === 'image' ){
                        delete child.image 
                    } else {
                        delete child.content
                        //child.content = res[child.field]
                    }

                })
                this.$action()
            }
        }
    },
    mounted(){
        this.schema = this.$mapState().datastore.schema [ this.$mapState().editor.current.data.dataset ]
        
        this.$api.service ( this.$mapState().editor.current.data.dataset ).find().then ( res => {
            this.data = res.data
        })
    }
}
</script>