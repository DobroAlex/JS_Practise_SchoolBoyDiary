<template>
    <div class="adminPageList">
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
                    <button type="submit" v-on:click="deleteButtonClicked(user._id)"> Delete </button>
                </p>
            </tr>
        </table>
    </div>
</template>

<script>
import UsersService from '../services/UsersService'
import { async, all } from 'q'
import UsersVue from './Users.vue';
export default {
    'name': 'AdmiPageList',
    data() {
        return{
            users: []
        }

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

        getUsers: async function() {
            try{
                const response = await UsersService.getUsers(sessionStorage.getItem('token'))
                this.users = response.data.users
            }
            catch(e) {
                if (e.response.status == 401) {
                    await this.refreshToken()
                    await this.getUsers()
                }
                else if (e.response.status == 403) {
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
        deleteButtonClicked: async function(targetID) {
            try {
                await UsersService.deleteUser(sessionStorage.getItem('token'), targetID)
            }
            catch(e) {
                if (e.response.status == 401) {
                    await UsersService.refreshMe()
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
