<template>
    <div class="loginDiv">
        <form class="loginClass"  @submit.prevent="sendLogin" >
            <h1>Sign in</h1>

            <label>E-mail</label>
            <input required v-model.lazy="email" type="email" placeholder="somemail@ex.ru"/>
            
            <label>Password</label>
            <input required v-model.lazy="password" type="password" placeholder="password"/>

            <hr>
            <button type="submit" :disabled="submitStatus==='PENDING'" v-on:click="sendLogin">Log in</button>
            <p class="error" v-if="submitStatus==='ERROR'">No such username or password</p>
            <p class="pendingMSG" v-if="submitStatus==='PENING'">Sending, plz wait...</p>
            </form>

        <form class="goToRegistration">
            <label>Doesn't have account?</label>
            <label class="clickableLable" v-on:click="goToRegistration">Create one</label>
        </form>
    </div>
</template>

<script>
import UsersService from "../services/UsersService"

import { required, minLength, between } from 'vuelidate/lib/validators'

export default {
    name: 'login',
    data(){
        return {
            email: '',
            password: '',
            submitStatus: null
        }
    },
    
    validations: {
        email: {required},
        password: {required}
    },

    methods: {
        sendLogin: async function() {
            if(this.$v.$invalid) {
                return false
            }
            try{
                this.submitStatus = 'PENDING'
                const response = await UsersService.login(this.email.toLowerCase(), this.password)
                this.submitStatus = 'OK'
                alert(response.data.token)
                sessionStorage.setItem('token', response.data.token)
                sessionStorage.setItem('refreshToken', response.data.refreshToken)
                this.$router.push({name: 'Me'})
            }
            catch(e) {
                this.submitStatus = 'ERROR'
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
