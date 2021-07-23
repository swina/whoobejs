<template>
    <div class="w-full md:w-1/3 flex flex-col">
        <h4>Create User</h4>
        <label>Username</label>
        <input type="text" v-model="newUser.username"/>
        <label>Email</label>
        <input type="email" v-model="newUser.email"/>
        <label>Password</label>
        <input type="password" v-model="newUser.password"/>
        <label>Confirm</label>
        <input type="password" v-model="confirm"/>
        <button class="mt-2 w-24" v-if="confirm === newUser.password" @click="createUser">Create</button>
        <div class="text-xs text-red-700" v-if="newUser.password && confirm != newUser.password">Passwords must match</div>
    </div>
</template>

<script>
export default {
    name: 'MokaUser',
    data:()=>({
        newUser: {
            username: '',
            email: '',
            password: '',
            confirmed: true
        },
        confirm: ''
    }),
    computed:{
        user(){
            let u = JSON.parse(window.localStorage.getItem('nuxpresso-user'))
            return u
        }
    },
    methods:{
        createUser(){
            this.$http.post ('users',this.newUser).then ( response => {
                console.log ( response )
            }).catch ( error => {
                console.log ( error )
            })
        }
    }
}
</script>