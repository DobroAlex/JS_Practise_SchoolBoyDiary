<template v-if="isLoading"> 
</template>

<template v-else>
    <div class="meForm">
        <form class="meClass">
            <h1>My page</h1>
            <label>Full Name:</label>
            <input required v-model="fullName"  :disabled="!isEditing">

            <label>email:</label>
            <input v-model="email" :disabled="true">

            <p>
                <label>School:</label>
                <input required v-model="school" :disabled="!isEditing">
                <label>Class:</label>
                <input v-model="schoolClass" :disabled="!isEditing">
            </p>

            <label>Phone Number:</label>
            <input required v-model="phoneNumber" :disabled="!isEditing">

            <hr>
            <button type="button" id="editButton" v-on:click="editButtonClicked">Edit me</button>
            <p>
                <button type="submit" id="saveChangesButton"   v-on:click="editButtonClicked">Save</button>
                <button type="button" id="cancelButton">Cancel</button>
            </p>
            <p v-if="isUpdated">Updated successfully</p>
        </form>
    </div>
</template>

<script>
import UsersService from '../services/UsersService'
import required from 'vuelidate/lib/validators'
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
        school: {required}
    },

    methods: {

        refreshMe: async function(){
                try{
                    const response = await UsersService.refreshMe({refreshToken: sessionStorage.getItem('refreshToken')})
                    sessionStorage.setItem('token', response.data.token)
                    sessionStorage.setItem('refreshToken', response.data.refreshToken)
                }
                catch(e) {
                    this.$router.push({name: 'Login'})
                }
        },

        getMe: async function() {
            this.isLoading = true
            try {
                const response = await UsersService.getMe({token: sessionStorage.getItem('token')})
                this.fullName = response.data.fullName
                this.email = response.data.email
                this.school = response.data.school
                this.schoolClass = response.data.class
                this.phoneNumber = response.data.phoneNumber
                this.description = response.data.description

                this.isLoading = false
            }
            catch(e) {
                let refresh
                if (e.response.status == 401) {
                     refresh = await this.refreshMe()
                    if (refresh) {
                        await this.getMe()
                        this.$router.push({name:'Login'})
                    }
                }
                else if (e.response.status == 400) {
                    this.$router.push({name: 'Login'})
                }

            }
        },
        editButtonClicked: function() {
            this.isEditing = !this.isEditing
            const editButton =  document.getElementById('editButton')
            const saveChangesButton = document.getElementById('saveChangesButton')
            const cancelButton = document.getElementById('cancelButton')
            if (this.isEditing) {
                editButton.style.visibility = 'hidden'
                saveChangesButton.style.visibility = 'visible'
                cancelButton.style.visibility = 'visible'
            }
            else {
                 editButton.style.visibility = 'visible'
                 saveChangesButton.style.visibility = 'hidden'
                 cancelButton.style.visibility = 'hidden'
            }
        },
        saveChangesButtonClicked: async function() {
            if (this.$v.$invalid) {
                return false
            }
            try{
                const response = await UsersService.putMe(this.email.toLowerCase(), this.fullName, this.school, 
                    this.schoolClass, this.phoneNumber, this.description, sessionStorage.getItem('token'))

                this.editButtonClicked()

                this.isUpdated = true
            }
            catch(e) {
                if (e.response.status == 401) {
                    await this.refreshMe()
                    await this.saveChangesButtonClicked()
                }
                else if(e.response.status == 400) {
                    this.$router.push({name: 'Login'})
                }
            }
        }
        
    },
    
    async beforeMount() {
        await this.getMe()
    },
    
    mounted() {
        document.getElementById('saveChangesButton').style.visibility = "hidden"
        document.getElementById('cancelButton').style.visibility = "hidden"
    }
    
}
</script>