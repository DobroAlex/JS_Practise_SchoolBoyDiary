import Vue from 'vue'
import Router from 'vue-router'
import Vuelidate from 'vuelidate'
import VModal  from 'vue-js-modal'

import AutoRedir from '@/components/AutoRedir'
import Login from '@/components/Login'
import Registration from '@/components/Registration'
import Me from '@/components/Me'
import AdminPageList from '@/components/AdminPageList'

Vue.use(Router)
Vue.use(Vuelidate)
Vue.use(VModal)

export default new Router({ //! !!!!https://stackoverflow.com/questions/45992932/vuejs-router-doesnt-load-the-component
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    
    {
      path: '/',
      name: 'AutoRedir',
      component: AutoRedir
    },

    {
      path: '/registration',
      name: 'Registration',
      component: Registration
    },
  
    {
      path: '/me',
      name: 'Me',
      component: Me
    },

    {
      path: '/admin/users',
      name: 'AdminPageList',
      component: AdminPageList
    }

  ]
})
