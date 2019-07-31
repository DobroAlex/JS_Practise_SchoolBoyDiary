<template>
    <div class="authForm">
        <form class="login" @submit.prevent="sendLogin">
            <h1>Sign in</h1>
            <label>E-mail</label>
            <input required v-model="email" type="text" placeholder="somemail@ex.ru"/>
            <label>Password</label>
            <input required v-model="password" type="password" placeholder="password"/>
            <hr>
            <button type="submit" v-on:click="sendLogin">Log in</button>
            <p class="error" v-if="authError">{{ authError }}</p>
            </form>

        <form class="goToRegistration">
            <label>Doesn't have account?</label>
            <label class="clickableLable" v-on:click="goToRegistration">Create one</label>
        </form>
    </div>
</template>

<script>
import UsersService from "../services/UsersService"

export default {
    name: 'login',
    data(){
        return {
            email: '',
            password: '',
            authError: '',
        }
    },
    methods: {
        sendLogin: async function() {
            if(!this.email || !this.password) { // TODO: find out about better way of validating, maybe with pure HTML/CSS
                return false
            }
            try{
                const response = await UsersService.login(this.email.toLowerCase(), this.password)

                sessionStorage.setItem('token', response.token)
                sessionStorage.setItem('refreshToken', response.refreshToken)

                this.$router.push({name: 'Me'})
            }
            catch(e){
                if(e.response.status === 404) {
                    this.authError = 'No such username was found'
                }
                if(e.response.status === 403) {
                    this.authError = 'Incorrect password'
                }
            }
        },
        goToRegistration: function() {
            this.$router.push({name: 'Registration'})
        }
    }
}
</script>

<style>
    .error {
        color: red;
    }

    .goToRegistration {
        padding-top: 24px
    }

    .clickableLable {
        color: blue;
    }
</style>
