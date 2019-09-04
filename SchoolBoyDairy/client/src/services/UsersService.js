import Api from '@/services/Api'

export default {
  login (email, password) {
      return Api().post('/public/login', {email: email, password: password})
  },

  register (email, password, fullName, school, _class, phoneNumber) {
      return Api().post('/public/register', {email: email, password: password, fullName: fullName, school: school, class: _class, phoneNumber: phoneNumber, description: ' '})

  },
  getMe (token) {
      return Api().get('/me', {headers: {
        authorization: 'Bearer ' + token
      }
      })
  },
  refreshMe (token) {
      return Api().post('/me/refresh', {refreshToken: token})
  },
  putMe(email, fullName, school, _class, phoneNumber, description, token, role){
      return Api().put('/me', {email: email, fullName: fullName, school: school, class: _class, 
        phoneNumber: phoneNumber, description: description, role: role}, {headers: {
          authorization: 'Bearer ' + token
        }
        })
  },
  deleteMe(token, targetID){
      return Api().delete('/me', {data:{id: targetID}, headers:{authorization: 'Bearer ' + token}})
  },

  getUsers(token){
      return Api().get('/admin/users', {headers:{authorization: 'Bearer ' + token}})
  },
  deleteUser(token, email){
      return Api().delete('/admin/users', {headers: { // https://stackoverflow.com/questions/43573297/put-request-with-simple-string-as-request-body
        Authorization: `Bearer ${token}`
      },
      data:{
        email:email
      }})
  },
  putUser(token, email, fullName, school, _class, phoneNumber, description, lessons, homeTasks, role ) {
      return Api().put('/admin/users', {email: email, fullName: fullName, school: school, class: _class, 
        phoneNumber: phoneNumber, description: description, lessons: lessons, homeTasks: homeTasks, role:role}, {headers: {
          authorization: 'Bearer ' + token
        }
        })
  },
  checkToken(token) {
      return Api().post('/me/checkToken', {token: token})
  },
  checkRefreshToken(refreshToken) {
      return Api().post('/me/checkRefreshToken', {refreshToken: refreshToken})
  }
}