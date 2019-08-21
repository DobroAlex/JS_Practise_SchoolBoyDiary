<template>
    <div class="adminPageList">
        <h1>Users</h1>
        <table>
            <tr v-for="user in users">
                <td> {{user._id}} </td>
                <td> {{user.fullName}} </td>
                <td> {{user.email}} </td>
                <td> {{user.description}} </td>
                <td> {{user.school}} </td>
                <td> {{user.class}} </td>
                <td> {{user.phoneNumber}} </td>
                <td> {{users.role}} </td>
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
                    const response = await UsersService.refreshMe({refreshToken: sessionStorage.getItem('refreshToken')})
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
                    await UsersService.refreshMe({refreshToken: sessionStorage.getItem('refreshToken')})
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
