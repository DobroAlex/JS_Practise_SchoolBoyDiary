<template >
    <div class="adminPageList" v-if="!isModalDisplaying">
        <h1>Users</h1>
        <table>
            <tr>
                <td> id </td>
                <td> full name </td>
                <td> email </td>
                <td> description </td>
                <td> school <td>
                <td> class </td>
                <td> phoneNumber </td>
                <td> role </td>
            </tr>
            <tr v-for="user in users">
                <td> {{user._id}} </td>
                <td> {{user.fullName}} </td>
                <td> {{user.email}} </td>
                <td> {{user.description}} </td>
                <td> {{user.school}} </td>
                <td> {{user.class}} </td>
                <td> {{user.phoneNumber}} </td>
                <td> {{user.role}} </td>
                <p>
                    <button type="submit" v-on:click="deleteButtonClicked(user.email)"> Delete </button>
                    <button type="submit" v-on:click="editUserButtonClicked(user)"> Edit this </button>
                </p>
            </tr>
        </table>
    </div>
        <div class="editModal" v-else>
        <label>Full Name:</label>
            <input required v-model="fullName">

            <label>email:</label>
            <input required v-model="email">

            <p>
                <label>School:</label>
                <input required v-model="school">
                <label>Class:</label>
                <input v-model="schoolClass">
            </p>

            <label>Phone Number:</label>
            <input required v-model="phoneNumber">

            <p>
                <label>Description</label>
                <textarea v-model="description" ></textarea>
            </p>
            <hr>
            <button type="button"  v-on:click="cancelEditButtonClicked">Cancel</button>
            <button type="button" v-on:click="saveButtonClicked">Save</button>
            
    </div>
</template>




<script>
import UsersService from '../services/UsersService'
import { checkTokensAndRefrsh } from '../sharedMethods/sharedMethods'
import { async, all } from 'q'

export default {
    'name': 'AdmiPageList',
    data() {
        return{
            users: [],
            fullName: '',
            email: '',
            school: '',
            schoolClass: '',
            phoneNumber: '',
            description: '',
            isModalDisplaying: false
        }

    },
    methods: {
        getUsers: async function() {
            await checkTokensAndRefrsh(sessionStorage, this.$router)
            
            try{
                const response = await UsersService.getUsers(sessionStorage.getItem('token'))
                this.users = response.data.users
            }
            catch(e) {
                alert(e)
                if (e.response.status == 403) {
                    alert('Hey, you are not admin, watcha doin\' here?')
                    sessionStorage.clear()
                    this.$router.push({name: 'Login'})
                }
                else {
                    sessionStorage.clear()
                    this.$router.push({name: 'Login'})
                }
            }
        },
        deleteButtonClicked: async function(targetEmail) {
            try {
                await UsersService.deleteUser(sessionStorage.getItem('token'), targetEmail)
                
                await this.getUsers()   // refreshing page after user delition
            }
            catch(e) {
                if (e.response.status == 401) {
                    await this.refreshToken()
                    await deleteButtonClicked(targetID)
                }
                else if (e.response.status == 404) {
                    location.reload(true)
                }
                else{
                    alert(e)
                    //this.$router.push({name:'Login'})
                }
            }
        },
        modifyUser: async function(){
            try {
                const response = await UsersService.putUser(sessionStorage.getItem('token'), this.email, this.fullName, this.school, 
                    this.schoolClass, this.phoneNumber, this.description)
            }
            catch(e) {
                if (e.response.status == 401) {
                    await this.refreshToken()
                    await this.modifyUser()
                }
                else{
                    alert(e.response)
                    this.$router.push({name: 'Login'})
                }
            }
        },
        editUserButtonClicked: async function(user) {
            this.isModalDisplaying = true
            this.fullName = user.fullName
            this.email = user.email
            this.school = user.school
            this.schoolClass = user.class
            this.phoneNumber = user.phoneNumber
            this.description = user.description
        },
        saveButtonClicked: async function() {
            await this.modifyUser()
            await this.getUsers()
            this.isModalDisplaying = false
        },
        cancelEditButtonClicked: async function() {
            this.isModalDisplaying = false
            await this.getUsers()
        }
    },

    async beforeMount() {
        try {
            await this.getUsers()
        }
        catch(e) {
            this.$router.push({name: 'Login'})
        }
    }
}
</script>
