<template>
    <div class="flex flex-col justify-start text-left p-4 theme-dark">
        <label>Email/Username</label>
        <input type="text" v-model="username"/>
        <label>Password</label>
        <input type="password" v-model="password"/>
        <button class="m-auto px-4 py-2 my-2 text-xl" @click="login">Login</button>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data:()=>({
        username: '',
        password: ''
    }),
    methods:{
        login(){
            this.$api.authenticate({
                email       : this.username,
                password    : this.password,
                strategy    : 'local'
            }).then ( user => {
                this.$store.state.user = user
                this.$message('Welcome to Whoobe Studio')
                this.$emit ( 'islogged' , true )
            }).catch ( err => {
                this.$message ( 'Login error! Check you credentials')
                this.$emit ( 'islogged' , false )
            })
        }
    }
}
</script>