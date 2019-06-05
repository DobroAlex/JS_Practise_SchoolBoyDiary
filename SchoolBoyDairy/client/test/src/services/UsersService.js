import Api from '@/services/Api'

export default {
  fetchUsers(){
    return Api().get('users')
  },
  addUser (params) {
    return Api().post('users', params)
  }

}
