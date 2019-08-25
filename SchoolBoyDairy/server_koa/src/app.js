const Koa = require('koa')
const app = new Koa()

const cors = require('@koa/cors')
app.use(cors())

const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

const koaRespond = require('koa-respond')
app.use(koaRespond())

const logger = require('koa-morgan')
app.use(logger('dev'))

const server = app.listen(8081 || process.env.PORT)
console.log(`Server is listening to ${server.address().port} `)

const mongoconnection = require('./mongoconnection')

mongoconnection.connectToMongo(mongoconnection.MONGO_USERS_ADDRESS, server)

app.use(async function handleError (context, next) {
  try {
    await next()
  } catch (error) {
    console.error(`Error occured: \n ${error} \n ${error.stack}`)
    if (error.status) {
      context.status = error.status
    }
    context.send(context.status, `${error}`)
  }
})

/* app.use(jwt({
  secret: jwtUtils.JWT_SECRET
}).unless({
  path: [/^\/public/, '/']
}))
*/

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use(async function (context, next) { // https://github.com/axios/axios/issues/853#issuecomment-351554276
  context.set('Access-Control-Allow-Origin', '*')
  context.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  context.set('Access-Control-Allow-Headers', 'Authorization')
  await next()
})

const publicRoutes = require('./routes/public_routes')
app.use(publicRoutes.routes())
app.use(publicRoutes.allowedMethods())
const meRoutes = require('./routes/me_routes')
app.use(meRoutes.routes())
app.use(meRoutes.allowedMethods())
const adminRoutes = require('./routes/admin_routes')
app.use(adminRoutes.routes())
app.use(adminRoutes.allowedMethods())
