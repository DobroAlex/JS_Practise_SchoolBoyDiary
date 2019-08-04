<template>
    <div class="meForm">
        <form class="meClass">
            <h1>My page</h1>
            <label>Full Name:</label>
            <input v-form="fullName"  :disabled="!isEditing">

            <label>email:</label>
            <input v-form="email" :disabled="!isEditing">

        </form>
    </div>
</template>

<script>
import UsersService from "../services/UsersService"
import { async, all } from 'q';


export default {
    name: 'me',
    data() {
        return {
            fullName: '',
            email: '',
            isEditing: false
        }
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
            try{
                const response = await UsersService.getMe({token: sessionStorage.getItem('token')})

                this.fullName = response.data.fullName
                this.email = response.data.email
            }
            catch(e) {
                let refresh
                if (e.response.status == 401) {
                     refresh = await this.refreshMe()
                }
                else if (e.response.status == 400) {
                    this.$router.push({name: 'Login'})
                }
                if (refresh) {
                    await getMe()
                }
            }
        }
    },
    beforeMount() {
         this.getMe()
    }
    
}
</script>
