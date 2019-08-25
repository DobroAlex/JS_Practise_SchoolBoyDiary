<template>
    <div v-if="isLoading">
        <label>L O A D I N G </label>
    </div>
    <div class="meForm" v-else>
        <form class="meClass" @submit.prevent="saveButtonClicked">
            <h1>My page</h1>
            <label>Full Name:</label>
            <input required v-model="fullName"  :readonly="!isEditing">

            <label>email:</label>
            <input required v-model="email" :readonly="true">

            <p>
                <label>School:</label>
                <input required v-model="school" :readonly="!isEditing">
                <label>Class:</label>
                <input v-model="schoolClass" :readonly="!isEditing">
            </p>

            <label>Phone Number:</label>
            <input required v-model="phoneNumber" :readonly="!isEditing">

            <p>
                <label>Description</label>
                <textarea v-model="description" :readonly="true"></textarea>
            </p>
            <hr>
            <button type="button" :disabled="isEditing" v-on:click="editButtonClicked">Edit me</button>
            <p>
                <button type="submit" :disabled="!isEditing"   v-on:click="saveButtonClicked">Save</button>
                <button type="button" :disabled="!isEditing" v-on:click="cancelButtonClicked">Cancel</button>
            </p>
            <p v-if="isUpdated">Updated successfully</p>
        </form>

        <hr>
        <button type="button" v-on:click='deleteButtonClicked'>Delete my page</button>
    </div>
</template>

<script>
import UsersService from '../services/UsersService'
import { isValidPhoneNumber, isValidClass } from '../validators/sharedValidators'
import { required } from 'vuelidate/lib/validators'
import { async, all } from 'q'

export default {
    name: 'me',
    data() {
        return {
            fullName: '',
            email: '',
            school: '',
            schoolClass: '',
            phoneNumber: '',
            description: '',
            isEditing: false,
            isUpdated: false,
            isLoading: true
        }
    },

    validations: {
        fullName: {required},
        school: {required},
        phoneNumber: {required, isValidPhoneNumber},
        schoolClass: {required, isValidClass}
    },

    methods: {

        refreshToken: async function(){
                try{
                    const response = await UsersService.refreshMe(sessionStorage.getItem('refreshToken'))
                    sessionStorage.setItem('token', response.data.token)
                    sessionStorage.setItem('refreshToken', response.data.refreshToken)
                }
                catch(e) {
                    sessionStorage.removeItem('refreshToken')
                    this.$router.push({name: 'Login'})
                }
        },

        getMe: async function() {
            this.isLoading = true
            if(!sessionStorage.getItem('token') || !sessionStorage.getItem('refreshToken')) {
                throw new Error
            }
            try {
                const response = await UsersService.getMe(sessionStorage.getItem('token'))
                this.fullName = response.data.fullName
                this.email = response.data.email
                this.school = response.data.school
                this.schoolClass = response.data.class
                this.phoneNumber = response.data.phoneNumber
                this.description = response.data.description

                this.isLoading = false
            }
            catch(e) {
                sessionStorage.removeItem('token')
                if (e.response.status == 401) {
                    await this.refreshToken()
                    await this.getMe()
                }
                else {
                    sessionStorage.clear()
                    this.$router.push({name: 'Login'})
                }

            }
        },

        editButtonClicked: function() {
            this.isEditing = true
            this.isUpdated = false
        },

        saveButtonClicked: async function() {
            if (this.$v.$invalid) {
                return false
            }
            if (!this.schoolClass.trim()){
                this.schoolClass = 'university'
            }
            try {
                const response = await UsersService.putMe(this.email.toLowerCase(), this.fullName, this.school, 
                this.schoolClass, this.phoneNumber, this.description, sessionStorage.getItem('token'))

                this.isUpdated = true

                this.isEditing = false

                this.getMe()

            }
            catch(e) {
                sessionStorage.removeItem('token')
                if (e.response.status == 401) {
                    await this.refreshToken()
                    await this.saveButtonClicked()
                }
                else {
                    sessionStorage.clear()
                    this.$router.push({name: 'Login'})
                }
            }
        },

        cancelButtonClicked: function() {
            this.isEditing = false

            this.getMe()

        },

        deleteButtonClicked: async function() {
            const resp = prompt("This is very serious decision and this can't be undone. Are you sure? If yes, input your email once more")
            if (resp !== null && (resp.toLowerCase() === this.email)) {
                try{
                     await UsersService.deleteMe(sessionStorage.getItem('token'))

                    sessionStorage.clear()

                    alert('Your page was deleted, rederecting you to login page')

                    this.$router.push({name: 'Login'})
                }
                catch(e) {
                    if (e.response.status == 401) {
                        await this.refreshToken()
                        await this.deleteButtonClicked()
                    }
                    else {
                        this.$router.push({name: 'Login'})
                    }
                }
            }
            else{
                    alert('Your real and given input mismatch')
                }
            
        }
        
    },
    
    async beforeMount() {
        try {
            await this.getMe()
        }
        catch(e) {
            this.$router.push({name: 'Login'})
        }
    }
    
}
</script>