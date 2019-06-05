<template>
    <div class="users">
      <h1>Add user</h1>
      <div class="form">
        <div>
          <input type="text" name="FL" placeholder="Fist+Last Names" v-model="FL">
        </div>
        <div>
          <textarea rows = "15" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
        </div>
        <div>
          <button class="app_add_new_user_btn" @click="addUser">Add New User</button>
        </div>
      </div>
    </div>
</template>

<script>
    import UsersService from '@/services/UsersService'
    export default {
        name: 'NewUser',
        data() {
          return {
            FL: '',
            description: ''
          }
        },
        methods: {
            async addUser() {
              await  UsersService.addUser({
                  FL: this.FL,
                  description: this.description
              });
              this.$router.push({name: 'Users'})
            }
        }
    }
</script>

<style type="text/css">
  .form input, .form textarea {
    width: 500px;
    padding: 10px;
    border: 1px solid #e0000d;
    outline: none;
    font-size: 12px;
  }
  .form div {
    margin: 20px;
  }
  .app_add_new_user_btn {
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
