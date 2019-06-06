<template>
  <div class="users">
    <h1>Users</h1>
    <div v-if="users.length > 0" class="table-wrap">
      <div>
        <router-link v-bind:to="{ name: 'NewUser' }" class="">Add User</router-link>
      </div>
      <table>
        <tr>
          <td>First & Last Names</td>
          <td width="640"> Description </td>      <!-- TODO: remove deprecated param width  -->
          <td width="200" align="center"> Action </td>
        </tr>
        <tr v-for="user in users">
          <td>{{ user.FL }}</td>
          <td>{{ user.description }}</td>
          <td align="center">
            <router-link v-bind:to="{ name: 'EditUser', params: { id:user._id } }"> Edit User </router-link> |  <!-- Visual Separation symbol -->
            <a href="#" @click="deleteUser(user._id)">Delete User</a>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      No users exist. One should add some <br /> <br />   <!-- Let's pour some XHTML here -->
      <router-link v-bind:to="{ name: 'NewUser' }" class="add_user_link">Add User</router-link>
    </div>
  </div>
</template>


<script>
  import UserService from '@/services/UsersService'
  export default {
    name: 'users',
    data() {
      return {
        users: []
      }
    },
    mounted() {
      this.getUsers()
    },
    methods: {
      async getUsers() {
        const response = await UserService.fetchUsers();
        this.users = response.data.users
      },
      async deleteUser(id) {
        const $this = this;
        $this.$swal({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#282cf7',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete him!'
        }).then(function (res) {
          if (res.value) {
            UserService.deleteUser(id);
            $this.$router.go({
              path: '/'
            })
          }
        })
      }
    }
  }
</script>
<style type="text/css">
  .table-wrap {
    width: 60%;
    margin: 0 auto;
    text-align: center;
  }
  table th, table tr {
    text-align: left;
  }
  table thead {
    background: #f2f2f2;
  }
  table tr td {
    padding: 10px;
  }
  table tr:nth-child(odd) {
    background: #f2f2f2;
  }
  table tr:nth-child(1) {
    background: #4d7ef7;
    color: #fff;
  }
  a {
    color: #4d7ef7;
    text-decoration: none;
  }
  a.add_user_link {
    background: #4d7ef7;
    color: #fff;
    padding: 10px 80px;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
  }
</style>
