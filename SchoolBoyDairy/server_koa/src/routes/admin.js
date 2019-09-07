const middlewares = require('../middlewares/admin')

const Router = require('koa-router')
const router = new Router()

router.get('/admin/users', middlewares.getUsers)

router.post('/admin/users', middlewares.postUser)

router.put('/admin/users/', middlewares.putUser)

router.delete('/admin/users', middlewares.deleteUser) // admin wants to delete user

module.exports = router
