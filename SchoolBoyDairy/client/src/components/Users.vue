<template>
  <div class="users">
    This file will list all the users.

    <div v-for="user in users">
      <p>
        <span><b>{{ user.FL }}</b></span> <br />     <!--First name Last name -->
        <span>{{ user.description }}</span>
      </p>
    </div>
  </div>
</template>

<script>
  import UsersService from "../services/UsersService";

  export default {
    name: 'Users',
    data () {
      return {
        users: []
      }
    },
    mounted() {
      this.getUsers()
    },
    methods:{
      async getUsers() {
        const response = await UsersService.fetchUsers();
        this.users = response.data
      }
    }
  }
</script>
