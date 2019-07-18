const koa = require('koa')
const bodyParser = require('koa-bodyparser')
// const cors = require('cors');
const logger = require('koa-morgan')
const koaRouter = require('koa-router')
const koaRespond = require('koa-respond')
const jwt = require('koa-jwt')
const bcrypt = require('bcrypt')
const utils = require('./utils')
const validator = require('./validator')
const mongoconnection = require('./mongoconnection')
const jwtUtils = require('./jwt-utils')
const app = new koa()
const router = new koaRouter()
const User = require('../models/user')
app.use(logger('dev'))
app.use(bodyParser())
app.use(koaRespond())
const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })
const ajvSchems = require('./ajv-schems')
// app.use(cors());
const server = app.listen(8081 || process.env.PORT)
console.log(`Server is listening to ${server.address().port} `)

let db
try {
  db = mongoconnection.connectToMongo(mongoconnection.MONGO_ADDRESS)
  console.log(`Connected to Mongo`)
} catch (e) {
  console.error(`Couldn't connect to Mongo  at ${mongoconnection.MONGO_ADDRESS}: \n ${e}`)
  server.close()
}

app.use(async function handleError (context, next) {
  try {
    await next()
  } catch (error) {
    console.error(`Error occured: \n ${error}`)
    context.send(context.status, `${error}`)
  }
})
app.use(jwt({
  secret: utils.SECRET
}).unless({
  path: [/^\/public/, '/']
}))

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

router.post('/public/register', async (context, next) => {
  await validator.validate(ajv, ajvSchems.REGISTER_USER_SCHEMA, context.request.body, context)
  const hashedPass = await bcrypt.hash(context.request.body.password, utils.HASH_ROUNDS)
  const requestBody = context.request.body
  await validator.IsFreeEmail(User, requestBody.email, context)
  let newUser = new User({
    fullName: requestBody.fullName,
    school: requestBody.school,
    mail: requestBody.email,
    password: hashedPass
  })
  await newUser.save()
  context.send(201, {
    message: `User ${requestBody.fullName} (${requestBody.email} saved)`
  })
})

router.post('/public/login', async (context, next) => {
  await validator.validate(ajv, ajvSchems.LOGIN_USER_SCHEMA, context.request.body, context)
  const foundUser = await User.find({ mail: context.request.body.email }, '_id fullName password mail')
  if (!foundUser.length) {
    context.status = 404
    throw new Error(`No user ${context.request.body.email} has been found`)
  }
  if (await bcrypt.compare(context.request.body.password, foundUser[0].password)) {
    context.send(200, {
      token: jwtUtils.newAccesssToken({ email: context.request.body.email, role: foundUser[0]._id }),
      _id: foundUser[0]._id
    })
  } else {
    context.status = 403
    throw new Error('Incorrect password')
  }
})

router.get('/users', async (context, next) => {
  const foundUsers = await User.find({}, 'fullName description school class').sort({ _id: -1 })
  context.ok({ users: foundUsers })
})

router.post('/users', async (context, next) => {
  await validator.validate(ajv, ajvSchems.POST_USERS_SCHEMA, context.request.body, context)
  let requestBody = context.request.body
  let newUser = new User({
    fullName: requestBody.fullName,
    description: requestBody.description,
    school: requestBody.school,
    class: requestBody.class
  })
  await newUser.save()
  context.send(201, {
    message: `User ${requestBody.fullName} saved successfuly`
  })
})

router.get('/users/:id', async (context, next) => {
  await validator.validate(ajv, ajvSchems.GET_USERS_ID_SCHEMA, context.params, context, 404)
  await validator.validateID(User, context.params.id, context)
  const foundUser = await User.findById(context.params.id, 'fullName description')
  context.ok(foundUser)
})

router.put('/users/:id', async (context, next) => {
  await validator.validate(ajv, ajvSchems.PUT_USERS_ID_SCHEMA, context.request.body, 400)
  await validator.validateID(User, context.request.body._id, context)
  const foundUser = await User.findById(context.request.body._id, 'fullName description school class')
  let requestBody = context.request.body
  foundUser.fullName = requestBody.fullName
  foundUser.description = requestBody.description
  foundUser.school = requestBody.school
  foundUser.class = requestBody.class
  foundUser.save()
  context.ok({
    message: `User ${foundUser.fullName} updated`
  })
})

router.delete('/users/:id', async (context, next) => {
  await validator.validate(ajv, ajvSchems.DELETE_USERS_ID_SCHEMA, context.request.body)
  await validator.validateID(User, context.params.id)
  let foundUser = await User.findById(context.params.id)
  let userName = foundUser.fullName
  await User.findByIdAndDelete(context.params.id)
  context.send(201, {
    message: `User ${userName} deleted`
  })
})

app.use(router.routes())
