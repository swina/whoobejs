<template>
    <form 
        :key="key"
        :action="action"
        :id="getID" 
        name="mc-embedded-subscribe-form"
        @submit="submitPrevent($event)">
        <template v-for="block in form.blocks">
            <block-element
                v-if="block && !block.hasOwnProperty('blocks') && block.type!='slides' && !block.hasOwnProperty('items')"
                :key="block.id"
                :el="block"/>
            <block-preview-container 
                v-if="block && block.blocks"
                :doc="block"/>
        </template>
        <span v-if="form.hasOwnProperty('mailchimp')">
            <input type="hidden" name="u" :value="form.mailchimp.u"/>
            <input type="hidden" name="id" :value="form.mailchimp.id"/>
        </span>
    </form>
</template>

<script>
export default {
    name: 'BlockForm',
    data:()=>({
        id : null,
        key: null
    }),
    components: {
        'block-element' : () => import ( './moka.element.component.vue'),
        'block-preview-container' : () => import ( './moka.preview.container.vue' )
    },
    props: ['form'],
    computed:{
        action(){
            return this.form.hasOwnProperty('mailchimp') ? this.form.action + '-json' : this.form.action
        },
        getID(){
            return this.form.hasOwnProperty('mailchimp') ? 'mc-embedded-subscribe-form' : this.form.id
        }
    },
    methods:{
        submitPrevent(e){
            e.preventDefault()
            if ( this.form.hasOwnProperty('mailchimp') ){
                let form = document.querySelector('#mc-embedded-subscribe-form')
                this.form.action = this.form.action + '-json'
                let data = new FormData(form)
                this.sendForm(data)
            } else {
                let form = document.querySelector('#' + this.form.id )
                let data = new FormData(form)
                this.sendForm(data)
            }
        },
        sendForm ( data ){
            fetch  ( 
                this.form.action, 
                {
                    method: 'post' ,
                    body : data ,
                    mode: 'no-cors'
                }).then ( res => {
                    if (!res.ok) {
                       throw Error(response.statusText);
                    }
                    this.$message ( this.form.success )
                    this.key = this.$randomID()
                }).catch ( error => {
                    this.$message ( this.form.error )
                    console.log ( error )
                }) 
        }
    },
    mounted(){
        this.key = this.$randomID()
    }
}
</script>