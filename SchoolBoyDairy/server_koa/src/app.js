const koa = require('koa')
const app = new koa()

const bodyParser = require('koa-bodyparser')
const logger = require('koa-morgan')

const koaRouter = require('koa-router')
const router = new koaRouter()

const koaRespond = require('koa-respond')
const jwt = require('koa-jwt')
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })

const utils = require('./utils')
const validator = require('./validator')
const mongoconnection = require('./mongoconnection')
const jwtUtils = require('./jwt-utils')
const User = require('../models/user')

app.use(logger('dev'))
app.use(bodyParser())
app.use(koaRespond())

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
    console.error(`Error occured: \n ${error} \n ${error.stack}`)
    context.send(context.status, `${error}`)
  }
})

app.use(jwt({
  secret: jwtUtils.JWT_SECRET
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

  await validator.ValidateFreeEmail(User, requestBody.email, context)
  let newUser = new User({
    fullName: requestBody.fullName,
    description: requestBody.description,
    school: requestBody.school,
    mail: requestBody.email,
    password: hashedPass,
    class: requestBody.class,
    phoneNumber: requestBody.phoneNumber,
    role: 'user' /* by default, each new entity is a simple user. Real admin have to change his role to 'admin'
                 via MongoDB Compass */
  })
  await newUser.save()

  context.ok({ message: `User ${requestBody.fullName}: ${requestBody.email} saved` })
})

router.post('/public/login', async (context, next) => {
  await validator.validate(ajv, ajvSchems.LOGIN_USER_SCHEMA, context.request.body, context)

  const foundUser = (await User.find({ mail: context.request.body.email }, 'fullName password mail role'))[0]
  if (!foundUser) {
    context.status = 404
    throw new Error(`No user ${context.request.body.email} has been found`)
  }

  if (await bcrypt.compare(context.request.body.password, foundUser.password)) {
    context.send(200, {
      token: jwtUtils.newAccessToken({
        email: context.request.body.email,
        role: foundUser.role }) }
    )
  } else {
    context.status = 403
    throw new Error('Incorrect password')
  }
})

router.get('/users', async (context, next) => {
  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  const foundUsers = await User.find({}).sort({ _id: -1 }) // Get all of them

  context.ok({ users: foundUsers })
})

router.post('admin/users', async (context, next) => {
  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  await validator.validate(ajv, ajvSchems.POST_USER_SCHEMA, context.request.body, context)

  let requestBody = context.request.body
  let newUser = new User({
    fullName: requestBody.fullName,
    description: requestBody.description,
    school: requestBody.school,
    class: requestBody.class,
    mail: requestBody.email,
    role: requestBody.role, // admins may create other admins
    phoneNumber: requestBody.phoneNumber
  })

  await newUser.save()
  context.send(201, {
    message: `User ${requestBody.fullName} saved successfuly`
  })
})

router.get('/me', async (context, next) => {
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))

  await validator.validate(ajv, ajvSchems.JWT_TOKEN_SCHEMA, decoded, context, 404)

  const foundUser = (await User.find({ mail: decoded.email }, 'fullName description school class email phoneNumber role'))[0]

  context.ok(foundUser)
})

router.put('/me', async (context, next) => {
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))
  await validator.validate(ajv, ajvSchems.JWT_TOKEN_SCHEMA, decoded, context, 400) // validating token

  await validator.validate(ajv, ajvSchems.PUT_ME_SCHEMA, context.request.body, context) // validating request body

  const foundUser = (await User.find({ mail: decoded.email }, 'fullName description school class mail phoneNumber'))[0]
  let requestBody = context.request.body

  if (foundUser.mail !== requestBody.email) { // if user want's to edit his email the new one should be free
    await validator.ValidateFreeEmail(User, requestBody.email, context)
  }

  foundUser.fullName = requestBody.fullName
  foundUser.description = requestBody.description
  foundUser.school = requestBody.school
  foundUser.class = requestBody.class
  foundUser.mail = requestBody.email
  foundUser.phoneNumber = requestBody.phoneNumber

  await foundUser.save()
  context.ok({
    message: `User ${foundUser.fullName} : ${foundUser.mail} updated`
  })
})

router.delete('/users/:id', async (context, next) => { // admin wants to delete user
  const decoded = await jwtUtils.validateAdminRoleAndToken(context, ajv)
  await validator.validate(ajv, ajvSchems.DELETE_USERS_ID_SCHEMA, context.params)

  await validator.validateID(User, context.params.id)

  const foundUser = await User.findById(context.params.id)
  const userName = foundUser.fullName
  const userMail = foundUser.mail

  await User.findByIdAndDelete(context.params.id)
  context.send(201, {
    message: `User ${userName}: ${userMail} deleted`
  })
})

router.delete('/me', async (context, next) => { // user wants to delete self
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))

  await validator.validateEmail(User, decoded.email, context)

  const foundUser = (await User.find({ mail: decoded.email }))[0]
  const userName = foundUser.fullName
  const userMail = foundUser.mail

  await User.findByIdAndDelete(foundUser._id)
  context.send(201, {
    message: `User ${userName}: ${userMail} deleted`
  })
})

app.use(router.routes())
