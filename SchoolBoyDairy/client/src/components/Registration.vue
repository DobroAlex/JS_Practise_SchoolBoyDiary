<template>
    <div class="regForm">
        <form class="registration" @submit.prevent="registerMe">
            <h1>New User Registartion</h1>

            <label>E-mail</label>
            <input required v-model="email" type="email" placeholder="somemail@ex.ru">
            <label class="errorEmailTaken" v-if="errorEmailTaken">{{errorEmailTaken}}</label>

            <p>
            <label>Password</label>
            <input required v-model="password" type="password" placeholder="password">
            </p>

            <label>Password once again</label>
            <input required v-model="passwordRep" type="password" placeholder="password once again">
            <p class="errorPasswordMismatch" v-if="password !== passwordRep">passwords mismatch</p>
            
            <p>
            <label>Full Name</label>
            <input required v-model="fullName" type="text" placeholder="Ivan Ivanov">
            </p>

            <p>
            <label>School</label>
            <input required v-model="school" type="text" placeholder="School name">
            </p>

            <p>
            <label>Class</label>
            <input required v-model="schoolClass" type="text" placeholder="'Number-letter' or 'university'" pattern="(^(\d)|(10)|(11))-[а-я]{1}|university$">
            </p>

            <p>
            <label>Phone Number</label>
            <input required  v-model="phoneNumber" type="tel" placeholder="+79700000000" pattern="^\+\d{11}">
            </p>
        <button type="submit" @click="registerMe">Register me</button>
        </form>
    </div>
</template>

<script>
import UsersService from "../services/UsersService"


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
            errorEmailTaken: ''
        }
    },
    methods: {
        registerMe: async function() {
            try{
                const respond = await UsersService.register(this.email, this.password, this.fullName, this.school, this.schoolClass, this.phoneNumber)
                
                this.$router.push({name: 'Me'})
            }
            catch(e) {
                if (e.response.status === 422) {
                    this.errorEmailTaken = 'email is alreay in use'
                }
            }
        }
    }
}
</script>

<style>
    .errorEmailTaken {
        color: red
    }
    .errorPasswordMismatch {
        color: red
    }
</style>

