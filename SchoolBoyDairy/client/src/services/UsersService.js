import Api from '@/services/Api'

export default {
  fetchUsers() {
    return Api().get('users')
  },
  addUser(params) {
    return Api().post('users', params)
  },
  updateUser(params) {
    return Api().put('users/' + params.id, params);
  },
  getUser(params) {
    return Api().get('user/' + params.id);
  },
  deleteUser(id) {
    return Api().delete('users/' + id);
  },
  login(email, password){
    try{
      return  Api().post('public/login', {email: email, password: password})
    }
    catch(e){
      throw e
    }
  }
}
