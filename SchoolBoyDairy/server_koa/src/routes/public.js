const middleware = require('../middlewares/public')

const Router = require('koa-router')
const router = new Router()

router.post('/public/register', middleware.registerUser)

router.post('/public/login', middleware.postLogin)

module.exports = router
