const middleware = require('../middlewares/me')

const Router = require('koa-router')
const router = new Router()

router.post('/me/checkToken', middleware.checkToken)

router.post('/me/checkRefreshToken', middleware.checkRefreshToken)

router.post('/me/refresh', middleware.refreshMe)

router.get('/me', middleware.getMe)

router.put('/me', middleware.putMe)

router.delete('/me', middleware.deleteMe)

module.exports = router
