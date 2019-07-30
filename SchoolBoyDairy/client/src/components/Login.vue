<template>
    <div class="authForm">
        <form class="login" @submit.prevent="login">
            <h1>Sign in</h1>
            <label>E-mail</label>
            <input required v-model="username" type="text" placeholder="somemail@ex.ru"/>
            <label>Password</label>
            <input required v-model="password" type="password" placeholder="password"/>
            <hr>
            <button type="submit" @click="login">Log in</button>
            <p class="error" v-if="authError">{{ authError }}</p>
            </form>
    </div>
</template>

<script>
import UsersService from "../services/UsersService";
export default {
    name: 'login',
    data(){
        return {
            username: '',
            password: '',
            authError: '',
        }
    },
    methods: {
        async login() {
            try{
            const response = await UsersService.login(this.username, this.password)

            sessionStorage.setItem('token', response.token)
            sessionStorage.setItem('refreshToken', response.refreshToken)

            this.$router.push({name: 'me'})
            }
            catch(e){
                if(e.response.status === 404) {
                    this.authError = 'No such username was found'
                }
                if(e.response.status === 403) {
                    this.authError = 'Incorrect password'
                }
            }
        }
    }
}
</script>

<<style type="text/css">
    .error{
        color: red
    }