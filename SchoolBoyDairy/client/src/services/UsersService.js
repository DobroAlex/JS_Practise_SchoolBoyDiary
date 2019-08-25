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
  getMe (token) {
    try {
      return Api().get('/me', {headers: {
        authorization: 'Bearer ' + token
      }
      })
    } catch (e) {
      throw e
    }
  },
  refreshMe (token) {
    try {
      return Api().post('/me/refresh', {refreshToken: token})
    } catch (e) {
      throw e
    }
  },
  putMe(email, fullName, school, _class, phoneNumber, description, token){
    try {
      return Api().put('/me', {email: email, fullName: fullName, school: school, class: _class, 
        phoneNumber: phoneNumber, description: description}, {headers: {
          authorization: 'Bearer ' + token
        }
        })
    }
    catch(e) {
      throw e
    }
  },
  deleteMe(token, targetID){
    try{
      return Api().delete('/me', {id: targetID}, {headers:{authorization: 'Bearer ' + token}})
    }
    catch(e) {
      throw e
    }
  },
  getUsers(token){
    try{
      return Api().get('/admin/users', {headers:{authorization: 'Bearer ' + token}})
    }
    catch(e) {
      throw e
    }
  },
  deleteUser(token, email){
    try{
      return Api().delete('/admin/users', {headers: { // https://stackoverflow.com/questions/43573297/put-request-with-simple-string-as-request-body
        Authorization: `Bearer ${token}`
      },
      data:{
        email:email
      }})
    }
    catch(e) {
      throw e
    }
  },
  putUser(token, email, fullName, school, _class, phoneNumber, description ) {
    try {
      return Api().put('/admin/users', {email: email, fullName: fullName, school: school, class: _class, 
        phoneNumber: phoneNumber, description: description}, {headers: {
          authorization: 'Bearer ' + token
        }
        })
      }
    catch(e) {
      throw e
    }
  }
}