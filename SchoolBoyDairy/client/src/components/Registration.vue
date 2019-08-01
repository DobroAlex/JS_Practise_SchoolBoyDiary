<template>
    <div class="regForm">
        <form class="registration" @submit.prevent="registerMe">
            <h1>New User Registartion</h1>

            <label>E-mail</label>
            <input required v-model.lazy.lazy="email" type="email" placeholder="somemail@ex.ru">
            <p class="error" v-if="!$v.email.required">Emial required</p>
            <p class="error" v-if="!$v.email.isValidEmail">Invalid email</p>
            <p class="error" v-if="submitStatus==='EMAIL_IN_USE'">{{submitStatus}}</p>

            <p>
            <label>Password</label>
            <input required v-model.lazy="password" type="password" placeholder="password">
            <p class="error" v-if="!$v.password.required">Password required</p>
            <p class="error" v-if="!$v.password.isValidPassword">Password must have at least 1 capital & one number</p>
            
            <p>
            <label>Password once again</label>
            <input required v-model.lazy="passwordRep" type="password" placeholder="password once again">
            <p class="error" v-if="password !== passwordRep">passwords mismatch</p>
            
            
            <p>
            <label>Full Name</label>
            <input required v-model.lazy="fullName" type="text" placeholder="Ivan Ivanov">
            </p>

            <p>
            <label>School</label>
            <input required v-model.lazy="school" type="text" placeholder="School name">
            <p class="error" v-if="!$v.school.required">Name of educational facility required</p>

            <p>
            <label>Class</label>
            <input  v-model.lazy="schoolClass" type="text" placeholder="'Number-letter' or empty if university">
            </p>

            <p>
            <label>Phone Number</label>
            <input required  v-model.lazy="phoneNumber" type="tel" placeholder="+12300000000">
            </p>

        <button type="submit" :disabled="submitStatus==='PENDING'" @click="registerMe">Register me</button>
        <p class="OK" v-if="submitStatus==='OK'">Successes!</p>
        <p class="error" v-if="submitStatus==='MAILFORMED'">Check forn=m once more</p>
        <p class="pendingMSG" v-if="submitStatus==='PENING'">Registarting you, plz wait..</p>
        </form>
    </div>
</template>

<script>
import UsersService from "../services/UsersService"
import { required, minLength, between } from 'vuelidate/lib/validators'
import {isValidEmail, isValidPassword, isValidClass, isValidPhoneNumber} from "../validators/shraedValidators"
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
            submitStatus: null
        }
    },
    validations: {
        email: {required, isValidEmail},
        password: {required, isValidPassword},
        password: {required},
        phoneNumber: {required, isValidPhoneNumber},
        school: {required}
    },

    methods: {
        registerMe: async function() {
            if(this.$v.$invalid) {
                return false
            }
            try{
                this.submitStatus = 'PENDING'

                const respond = await UsersService.register(this.email, this.password, this.fullName, this.school, this.schoolClass, this.phoneNumber)

                this.submitStatus = 'OK'

                this.$router.push({name: 'Me'})
            }
            catch(e) {
                if (e.response.status === 422) {
                    this.submitStatus = 'EMAIL_IN_USE'
                }
                if (e.response.status === 400) {
                    this.submitStatus = 'MAILFORMED'
                }
            }
        },
        fillEmptyFields: async function(){
            if(!this.schoolClass) {
                this.school = 'university'
            }
            if(!this.phoneNumber) {
                this.phoneNumber = '+79700000000'
            }
        }
    }
}
</script>

<style>
    .error {
        color: red
    }

</style>

