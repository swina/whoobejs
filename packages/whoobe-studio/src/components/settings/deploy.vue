<template>
    <div class="p-4" v-if="enabled">
        <h3>NUXPRESSO PUBLISH WEBHOOK</h3>
        <input type="text" v-model="user.build" class="w-1/2"/><button @click="deployNuxpresso">Publish</button>
        <br/>
        <i class="text-sm">This will deploy nuxpresso front-end website</i>
        <br/>
        <i class="text-sm text-red-500">{{error}}</i>
    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
export default {
    name: 'MokaDeploy',
    data:()=>({
        deploy: '',
        error: ''
    }),
    computed:{
        ...mapState ( ['user'] ),
        enabled(){
            if ( typeof webpackHotUpdate === 'undefined') this.$store.dispatch('message','This option is available only in development mode')
            return typeof webpackHotUpdate != 'undefined' ? true : false 
        }
    },
    methods:{
        deployNuxpresso(){
            axios.post ( this.user.build ,{}).then ( response => {
                this.$store.dispatch ( 'message' , 'Deployment started correctly')
            }).catch ( error => {
                this.$store.dispatch ( 'message' , 'An error occured')
                this.error = error
            })
        }
    }

}
</script>