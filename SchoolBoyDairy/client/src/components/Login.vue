<template>
    <div>
        <modal name='errorLogin'
            :classes="['v--modal']"
            :pivot-y="0.2"
            :width="240"
            :height="84"
            >
            <div class="errorModalHeader">ERROR</div>
            <div class="errorModalContent">
                <label> Incorrect login or password </label>
                <br>
                <div class="transparentBckgLine">
                    <button class="errorOkButton" v-on:click="modalOkClicked">OK</button>
                </div>
            </div>
        </modal>

        <div class="loader" v-if="submitStatus==='PENDING'"></div>
        <div class="loginDiv" v-else>
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
    </div>
</template>

<script>
import UsersService from "../services/UsersService"
import { registerModal, showModal, hideModal, getModalFromThis } from '../sharedMethods/sharedModalMethods'
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'login',
    data(){
        return {
            email: '',
            password: '',
            submitStatus: undefined
        }
    },
    
    validations: {
        email: {required},
        password: {required}
    },

    methods: {
        beforeOpen(event) {

        },
        beforeClose(event) {
            event.stop()
        },
        modalOkClicked() {
            hideModal('errorLogin')
        },

        sendLogin: async function() {
            if(this.$v.$invalid) {
                return false
            }
            try{
                this.submitStatus = 'PENDING'
                this.email = this.email.trim()
                const response = await UsersService.login(this.email.toLowerCase(), this.password)
                this.submitStatus = 'OK'
                sessionStorage.setItem('token', response.data.token)
                sessionStorage.setItem('refreshToken', response.data.refreshToken)
                this.$router.push({name: 'Me'})
            }
            catch(e) {
                showModal('errorLogin')
                this.submitStatus = 'ERROR'
            }
        },
        goToRegistration: function() {
            this.$router.push({name: 'Registration'})
        }
    },
    beforeMount() {
        registerModal(getModalFromThis(this))
    }
}
</script>

<style>
@import '../styles/loader.css';
@import '../styles/error.css';
@import '../styles/clickableLable.css';
@import '../styles/errorLogin.css';
@import '../styles/transparentBckgLine.css';
</style>
