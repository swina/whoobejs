<template>
    <div class="flex flex-col p-4 theme-dark text-gray-300">
        <label>Name</label>
        <input class="dark w-full" type="text" v-model="editor.current.name"/>
        <label>Action</label>
        <input class="dark w-full" type="text" v-model="editor.current.action"/>
        <label>Success message</label>
        <input class="dark w-full" type="text" v-model="editor.current.success"/>
        <label>Redirect to</label>
        <input class="dark w-full" type="text" v-model="editor.current.redirect"/>
        <label>Error message</label>
        <input class="dark w-full" type="text" v-model="editor.current.error"/>
        <label>Mailchimp Short URL</label>
        <input class="dark w-full" type="text" v-model="mailchimpUrl"/>
        <div v-if="mailchimp_email" class="font-bold border border-red-600 p-1">
            {{ mailchimp_email}}
        </div>
        <div class="flex flex-row">
            <input type="checkbox" v-model="editor.current.netlify"/> Netlify Form
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'MokaEditorFormSettings',
    data: ()=>({
        mailchimpUrl: '',
        mailchimp_email: ''
    }),
    computed:{
        ...mapState ( ['editor'] )
    },
    watch: {
        mailchimpUrl(v){
            if ( v ){
                this.mc(v)
            }
        }
    },
    methods: {
        mc(url){
            this.$api.service('proxy').find ( { query : { url : url } } )
                .then ( res => {
                    this.editor.current.action = res.action 
                    this.editor.current.mailchimp = {}
                    res.fields.forEach ( field => {
                        console.table ( field )
                        if ( field.name === 'u' || field.name === 'id' ){
                            this.editor.current.mailchimp[field.name] = field.value
                        }
                        if ( field.type === 'email' && field.name != 'b_email' ){
                            this.mailchimp_email = 'Your form must have an email field with ' + field.name + ' name'
                        }
                    })
                })
        }
    }
    
}
</script>

