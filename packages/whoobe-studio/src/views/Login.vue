<template>
    <div class="cursor-pointer bg-gray-800 bg-center bg-cover bg-no-repeat h-screen w-screen flex flex-col items-center justify-center" title="Click to start" style="background-image:url(https://res.cloudinary.com/moodgiver/image/upload/v1616863115/desktop-1155613_1920_eimtxw.jpg);">
        <div class="modal z-2 theme-dark w-full md:w-1/2 lg:w-1/3 border border-black shadow-xl text-lg flex flex-col rounded-lg">
            <div class="w-full p-2 bg-black text-white rounded-tl rounded-tr">Whoobe Login</div>
            <div class="p-8 flex flex-col">
                <label>Email</label>
                <input class="mb-4 w-full text-xl py-2" type="email" v-model="userLogin.email"/>
                <label>Password</label>
                <input class="py-2 text-xl w-full" type="password" v-model="userLogin.password"/>
                <button class="my-4 p-4 mx-auto text-xl rounded" @click="doLogin()">Login</button>
            </div> 
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginView',
    data:()=>({
        userLogin: {
            email: 'admin',
            password: 'password'
        }
    }),
    methods:{
        doLogin(){
            this.$api.authenticate({
                email: this.userLogin.email,
                password: this.userLogin.password,
                strategy: 'local'
            }).then ( resp => {
                this.$message ( 'Welcome to Whoobe !')
                this.login = false 
                this.$store.dispatch('login',true)
                this.$router.push ( '/' )
            }).catch ( err => {
                console.log ( err )
                this.$store.dispatch('login',false)
                this.$message ( 'Login error! Check your credentials')
            })
        }
    }
}
</script>