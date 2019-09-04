<template>
    <div class="defaultPageStyle">
        <modal name='successReg'
            :classes="['v--modal']"
            :pivot-y="0.2"
            :width="240"
            :height="240"
            >
            <div class="successRegHeader">success!</div>
            <div class="successRegContent">
                <label> You have completed registation </label>
                <br>
                <label> You will be automaticly transferred to your page. If not, press button below </label>
                <br>
                <div class="transparentBckgLine">
                    <button class="successRegOkButton" v-on:click="successRegOkButtonClicked">OK</button>
                </div>
            </div>
        </modal>
        <div class="loader" v-if="submitStatus==='PENDING'"></div>
        <div class="registrationDiv" v-else>
            <form class="registrationForm" @submit.prevent="registerMeButtonClicked">
                <h1>New User Registartion</h1>

                <label>E-mail</label>
                <input required v-model.lazy="email" type="email" placeholder="somemail@ex.ru">
                <p class="error" v-if="!$v.email.required && email">Emial required</p>
                <p class="error" v-if="submitStatus==='EMAIL_IN_USE'">This email is already in use</p>

                <p>
                <label>Password</label>
                <input required v-model.lazy="password" type="password" placeholder="password">
                <p class="error" v-if="!$v.password.required && password">Password required</p>
                <p class="error" v-if="!$v.password.isValidPassword && password">Password must have at least 1 capital 
                    and one number and be at least 8 chars long</p>
                
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
                <p class="error" v-if="!$v.schoolClass.isValidClass && schoolClass">Incorrect class, better leave it empty</p>

                <p>
                <label>Phone Number</label>
                <input   v-model="phoneNumber" type="tel" placeholder="+12300000000">
                </p>

            <button type="submit" :disabled="submitStatus==='PENDING'" @click="registerMeButtonClicked">Register me</button>
            <p class="OK" v-if="submitStatus==='OK'">Successes!</p>
            <p class="error" v-if="submitStatus==='MAILFORMED'">Check form once more</p>
            <p class="error" v-if="submitStatus==='NET_ERROR'">There is something wrong with network, refresh this page</p>
            </form>
        </div>
    </div>
</template>

<script>
import UsersService from "../services/UsersService"
import { required, minLength, between } from 'vuelidate/lib/validators'
import { isValidEmail, isValidPassword, isValidPhoneNumber, isValidClass } from "../validators/sharedValidators"
import { registerModal, showModal, hideModal, getModalFromThis }  from '../sharedMethods/sharedModalMethods'
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
        school: {required},
        schoolClass: { isValidClass},
        phoneNumber: {required, isValidPhoneNumber}
    },

    methods: {
        registerMeButtonClicked: async function() {
            if(this.$v.schoolClass.$invalid) {
                this.schoolClass = 'university'
            }
            if(this.$v.school.$invalid){
                this.school = '-'
            }
            if(this.$v.phoneNumber.$invalid) {
                this.phoneNumber = '+79700000000'
            }
            if(this.$v.$invalid) {
                return false
            }

            try{
                this.submitStatus = 'PENDING'

                if(!this.schoolClass.trim()) {
                    this.schoolClass = 'university'
                }

                if(!this.phoneNumber.trim()) {
                    this.phoneNumber = '+79700000000'
                }

                await  this.registerMe()

                this.submitStatus = 'OK'

                showModal('successReg')

                window.setTimeout(() => {
                    this.$router.push({name: 'Login'}) // redirecting to me in  3 sec
                }, 3000)    
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

        registerMe: async function() {
                const response = await UsersService.register(this.email.toLowerCase(), this.password, this.fullName, this.school, this.schoolClass, this.phoneNumber)
        },

        successRegOkButtonClicked: function() {
            this.$router.push({name: 'Login'})
        }
    },
    beforeMount() {
        registerModal(getModalFromThis(this))
    }
}
</script>

<style>
    @import '../styles/defaultPageStyle.css';
    @import '../styles/loader.css';
    @import '../styles/error.css';
    @import '../styles/clickableLable.css';
    @import '../styles/errorLogin.css';
    @import '../styles/transparentBckgLine.css';
</style>

