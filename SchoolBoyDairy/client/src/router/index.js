import Vue from 'vue'
import Router from 'vue-router'
import  HelloWorld from '@/components/HelloWorld'
import Users from '@/components/Users' // this should work. If not, look at replacing / with \\
import NewUser from '@/components/NewUser'

Vue.use(Router);

export default new Router({ //!!!!!https://stackoverflow.com/questions/45992932/vuejs-router-doesnt-load-the-component
  mode: 'history',
  routes: [
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/users/new',
      name: 'NewUser',
      component: NewUser
    }

  ]
})
