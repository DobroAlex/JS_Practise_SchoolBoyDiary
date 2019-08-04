import Api from '@/services/Api'

export default {
  fetchUsers () {
    return Api().get('users')
  },
  addUser (params) {
    return Api().post('users', params)
  },
  updateUser (params) {
    return Api().put('users/' + params.id, params)
  },
  getUser (params) {
    return Api().get('user/' + params.id)
  },
  deleteUser (id) {
    return Api().delete('users/' + id)
  },
  login (email, password) {
    try {
      return Api().post('/public/login', {email: email, password: password})
    } catch (e) {
      throw e
    }
  },

  register (email, password, fullName, school, _class, phoneNumber) {
    try {
      return Api().post('/public/register', {email: email, password: password, fullName: fullName, school: school, class: _class, phoneNumber: phoneNumber, description: ' '})
    } catch (e) {
      throw e
    }
  },
  getMe ({token}) {
    try {
      return Api().get('/me', {headers: {
        authorization: 'Bearer' + token
      }
      })
    } catch (e) {
      throw e
    }
  },
  refreshMe ({refreshToken}) {
    try {
      return Api().post('/me/refresh', {refreshToken: refreshToken})
    } catch (e) {
      throw e
    }
  }

}
