<template>
    <div class="registrationDiv">
        <form class="registrationForm" @submit.prevent="registerMe">
            <h1>New User Registartion</h1>

            <label>E-mail</label>
            <input required v-model.lazy="email" type="email" placeholder="somemail@ex.ru">
            <p class="error" v-if="!$v.email.required && email">Emial required</p>
            <p class="error" v-if="submitStatus==='EMAIL_IN_USE'">This email is already in use</p>

            <p>
            <label>Password</label>
            <input required v-model.lazy="password" type="password" placeholder="password">
            <p class="error" v-if="!$v.password.required && password">Password required</p>
            <p class="error" v-if="!$v.password.isValidPassword && password">Password must have at least 1 capital and one number</p>
            
            <p>
            <label>Password once again</label>
            <input required v-model.lazy="passwordRep" type="password" placeholder="password once again">
            <p class="error" v-if="(password !== passwordRep) && passwordRep && password">Passwords mismatch</p>
            
            
            <p>
            <label>Full Name</label>
            <input required v-model.lazy="fullName" type="text" placeholder="Ivan Ivanov">
            <p class="error" v-if="!$v.fullName.required && fullName">Name required</p>

            <p>
            <label>School</label>
            <input required v-model="school" type="text" placeholder="School name">
            <p class="error" v-if="!$v.school.required && school">Name of educational facility required</p>

            <p>
            <label>Class</label>
            <input  v-model="schoolClass" type="text" placeholder="'Number-letter' or empty if university">
            </p>

            <p>
            <label>Phone Number</label>
            <input   v-model="phoneNumber" type="tel" placeholder="+12300000000">
            </p>

        <button type="submit" :disabled="submitStatus==='PENDING'" @click="registerMe">Register me</button>
        <p class="OK" v-if="submitStatus==='OK'">Successes!</p>
        <p class="error" v-if="submitStatus==='MAILFORMED'">Check form once more</p>
        <p class="error" v-if="submitStatus==='NET_ERROR'">There is something wrong with network, refresh this page</p>
        <p class="pendingMSG" v-if="submitStatus==='PENING'">Registarting you, plz wait..</p>
        </form>
    </div>
</template>

<script>
import UsersService from "../services/UsersService"
import { required, minLength, between } from 'vuelidate/lib/validators'
import { isValidEmail, isValidPassword } from "../validators/shraedValidators"
import { async } from 'q';

export default {
    name: 'registration',
    data() {
        return {
            email: '',
            password: '',
            passwordRep: '',
            fullName: '',
            school: '',
            schoolClass: '',
            phoneNumber: '',
            submitStatus: undefined
        }
    },
    validations: {
        email: {required},
        password: {required, isValidPassword},
        passwordRep: {required},
        fullName: {required},
        school: {required}
    },

    methods: {
        registerMe: async function() {
            if(this.$v.$invalid) {
                return false
            }
            try{
                this.submitStatus = 'PENDING'

                if(!this.schoolClass) {
                    this.schoolClass = 'university'
                }

                if(!this.phoneNumber) {
                    this.phoneNumber = '+79700000000'
                }
                const response = await UsersService.register(this.email.toLowerCase(), this.password, this.fullName, this.school, this.schoolClass, this.phoneNumber)

                this.submitStatus = 'OK'

                this.$router.push({name: 'Login'})
            }
            catch(e) {
                if (e.response.status == 422 ) {
                    this.submitStatus = 'EMAIL_IN_USE'
                }
                else if (e.response.status == 400) {
                    this.submitStatus = 'MAILFORMED'
                }
                else {
                    this.submitStatus = 'NET_ERROR'
                }
            }
        },
    }
}
</script>

<style>
    .error {
        color: red
    }

</style>

