<template>
    <div class="users">
      <h1>Edit User</h1>
      <div class="form">
        <div>
          <input type="text" name="FL" placeholder="First & Last Names" v-model="FL">
        </div>
        <div>
          <textarea rows="15" cols="15" placeholder="Description" v-model="description"></textarea>
        </div>
        <div>
          <button class="app_user_edit_btn" @click="updateUser">UpDate</button>
        </div>
      </div>
    </div>
</template>

<script>
    import UsersService from "../services/UsersService";
    import Users from "./Users";

    export default {
        name: "EditUser",
        data() {
          return {
            FL: '',
            description: ''
          }
        },
        mounted() {
          this.getUser()
        },
        methods: {
          async getUser() {
            const response = await UsersService.getUser({
              id: this.$route.params.id
            });
            this.FL = response.data.title;
            this.description = response.data.description;
          },
          async updateUser() {
            await UsersService.updateUser({
              id: this.$route.params.id,
              FL: this.FL,
              description: this.description
            });
            this.$router.push({name: 'Users'})
          }
        }
    }
</script>

<<style type="text/css">
  .form input, .form textarea {
    width: 500px;
    padding: 10px;
    border: 1px solid #e0dede;
    outline: none;
    font-size: 12px;
  }
  .form div {
    margin: 20px;
  }
  .app_user_edit_btn {
    background: #282cf7;
    color: #fff;
    padding: 10px 80px;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
    width: 520px;
    border: none;
    cursor: pointer;
  }

</style>
