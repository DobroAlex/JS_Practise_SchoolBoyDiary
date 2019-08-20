<template>
    <div class="adminPageList">
        <h1>Users</h1>
    </div>
</template>

<script>
import {getUsers} from '../services/UsersService'
import { async } from 'q'
export default {
    'name': 'AdmiPageList',
    data() {
        users: []
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
            catch{
                if (e.response.status == 401) {
                    await this.refreshToken()
                    await this.getUsers()
                }
                else if (e.response.status == 403) {
                    alert('Hey, you are not admin, watcha doin\' here')
                    sessionStorage.clear()
                    this.$router.push({name: 'Login'})
                }
                else {
                    sessionStorage.clear()
                    this.$router.push({name: 'Login'})
                }
            }
        }
    }
}
</script>
