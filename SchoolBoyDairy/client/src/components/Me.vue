<template>
    <div class="defaulPtageStyle">
        <div class="loader" v-if="isLoading === true"></div>
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

                <table>
                    <tr>
                        <td> Date </td>
                        <td> State </td>
                    </tr>
                    <tr v-for="lesson in lessons">
                        <td> {{lesson.date}} </td>
                        <td> {{lesson.state}} </td>
                    </tr>
                </table>

                <hr>
                <table>
                    <tr>
                        <td> Date </td>
                        <td> Task </td>
                        <td> State </td>
                    </tr>
                    <tr v-for="task in homeTasks">
                        <td> {{task.date}} </td>
                        <td> {{task.task}} </td>
                        <td> {{task.state}} </td>
                    </tr>
                </table>
                <hr>
                <button type="button" :disabled="isEditing" v-on:click="editButtonClicked">Edit me</button>
                <p>
                    <button type="button" :disabled="!isEditing" v-on:click="saveButtonClicked">Save</button>
                    <button type="button" :disabled="!isEditing" v-on:click="cancelButtonClicked">Cancel</button>
                </p>
                <p v-if="isUpdated">Updated successfully</p>
            </form>

            <hr>
            <button type="button" v-on:click='deleteButtonClicked'>Delete my page</button>
            
            <hr>
            <button type="button" :disabled="!this.checkAdminRole" v-on:click='pushToAdmin'> Admin entrance </button>
        </div>
    </div>
</template>

<script>
import UsersService from '../services/UsersService'
import { checkTokensAndRefrsh } from '../sharedMethods/sharedMethods'
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
            role: '',
            lessons: [],
            homeTasks: [],
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
        checkAdminRole: function(role) {
            return role === 'admin'
        },

        getMe: async function() {
            this.isLoading = true
            await checkTokensAndRefrsh(sessionStorage, this.$router)

            try {
                let response = await UsersService.getMe(sessionStorage.getItem('token'))
                response = response.data
                this.fullName = response.fullName
                this.email = response.email
                this.school = response.school
                this.schoolClass = response.class
                this.phoneNumber = response.phoneNumber
                this.description = response.description
                this.lessons = response.lessons
                this.homeTasks = response.homeTasks
                this.role = response.role
                this.isLoading = false
            }
            catch(e) {
                    sessionStorage.clear()  // This shouldn't occur normally unless server is dead
                    this.$router.push({name: 'Login'})  // In such case user must be transfered to login
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
                await checkTokensAndRefrsh(sessionStorage, this.$router)  

                const response = await UsersService.putMe(this.email.toLowerCase(), this.fullName, this.school, 
                this.schoolClass, this.phoneNumber, sessionStorage.getItem('token'), this.role)

                this.isUpdated = true

                this.isEditing = false

                await this.getMe()

            }
            catch(e) {
                sessionStorage.clear()
                this.$router.push({name: 'Login'})
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
                    checkTokensAndRefrsh(sessionStorage, this.$router)

                    await UsersService.deleteMe(sessionStorage.getItem('token'))

                    sessionStorage.clear()

                    alert('Your page was deleted, rederecting you to login page')

                    this.$router.push({name: 'Login'})
                }
                catch(e) {
                    this.$router.push({name: 'Login'})
                }
            }
            else{
                    alert('Your real email and given input mismatch')
                }
            
        },
        pushToAdmin() {
            this.$router.push({name:'AdminPageList'})
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

<style>
    @import '../styles/defaultPageStyle.css';
</style>