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

const db = mongoconnection.connectToMongo(mongoconnection.MONGO_USERS_ADDRESS, server)

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

router.post('/public/register', async (context, next) => {
  await validator.validate(ajv, ajvSchems.REGISTER_USER_SCHEMA, context.request.body)

  const hashedPass = await bcrypt.hash(context.request.body.password, utils.HASH_ROUNDS)

  const requestBody = context.request.body

  await validator.ValidateFreeEmail(User, requestBody.email)
  let newUser = new User({
    fullName: requestBody.fullName,
    description: requestBody.description,
    school: requestBody.school,
    email: requestBody.email,
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
  await validator.validate(ajv, ajvSchems.LOGIN_USER_SCHEMA, context.request.body)

  const foundUser = await User.findOne({ email: context.request.body.email }, 'fullName password email role')
  if (!foundUser) {
    throw utils.errorGenerator(`No user ${context.request.body.email} has been found`, 404)
  }

  if (await bcrypt.compare(context.request.body.password, foundUser.password)) {
    context.send(200, {
      token: jwtUtils.newAccessToken({
        email: context.request.body.email,
        role: foundUser.role }) }
    )
  } else {
    throw utils.errorGenerator('Incorrect passwrod', 403)
  }
})

router.get('/users', async (context, next) => {
  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  const foundUsers = await User.find({}).sort({ email: -1 }) // Get all of them

  context.ok({ users: foundUsers })
})

router.post('/users', async (context, next) => {
  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  await validator.validate(ajv, ajvSchems.POST_USER_SCHEMA, context.request.body)

  let requestBody = context.request.body
  let newUser = new User({
    fullName: requestBody.fullName,
    description: requestBody.description,
    school: requestBody.school,
    class: requestBody.class,
    email: requestBody.email,
    role: requestBody.role, // admins may create other admins
    phoneNumber: requestBody.phoneNumber
  })

  await newUser.save()
  context.send(201, {
    message: `User ${requestBody.fullName}: ${requestBody.email} saved)`
  })
})

router.get('/users/:id', async (context, next) => {
  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  await validator.validateID(User, context.params.id, context)

  const foundUser = await User.findById(context.params.id, '')

  context.ok({ user: foundUser })
})

router.put('/users/:id', async (context, next) => {
  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  await validator.validateID(User, context.params.id, context)

  await validator.validate(ajv, User, context.request.body)

  const foundUser = await User.findById(context.params.id, '')
  let requestBody = context.request.body

  foundUser.fullName = requestBody.fullName
  foundUser.description = requestBody.description
  foundUser.school = requestBody.school
  foundUser.class = requestBody.class
  foundUser.phoneNumber = requestBody.phoneNumber
  foundUser.role = requestBody.role // admin may change any user role

  await foundUser.save()

  context.ok({
    message: `User ${requestBody.fullName}: ${requestBody.email} updated`
  })
})

router.get('/me', async (context, next) => {
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))

  await validator.validate(ajv, ajvSchems.JWT_TOKEN_SCHEMA, decoded)

  const foundUser = await User.findOne({ email: decoded.email }, 'fullName description school class email phoneNumber')

  context.ok(foundUser)
})

router.put('/me', async (context, next) => {
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))
  await validator.validate(ajv, ajvSchems.JWT_TOKEN_SCHEMA, decoded) // validating token

  await validator.validate(ajv, ajvSchems.PUT_ME_SCHEMA, context.request.body) // validating request body

  const foundUser = await User.findOne({ email: decoded.email }, 'fullName description school class email phoneNumber')
  let requestBody = context.request.body
  foundUser.fullName = requestBody.fullName
  foundUser.description = requestBody.description
  foundUser.school = requestBody.school
  foundUser.class = requestBody.class
  foundUser.email = requestBody.email
  // foundUser.phoneNumber = requestBody.phoneNumber

  await foundUser.save()

  context.ok({
    message: `User ${foundUser.fullName} : ${foundUser.email} updated`
  })
})

router.delete('/users/:id', async (context, next) => { // admin wants to delete user
  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  await validator.validate(ajv, ajvSchems.DELETE_USERS_ID_SCHEMA, context.params)

  await validator.validateID(User, context.params.id)

  const foundUser = await User.findById(context.params.id)
  const userName = foundUser.fullName
  const userMail = foundUser.email

  await User.findByIdAndDelete(context.params.id)
  context.send(201, {
    message: `User ${userName}: ${userMail} deleted`
  })
})

router.delete('/me', async (context, next) => { // user wants to delete self
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))

  await validator.validateEmail(User, decoded.email)

  const foundUser = (await User.find({ email: decoded.email }))[0]
  const userName = foundUser.fullName
  const userMail = foundUser.email

  await User.findByIdAndDelete(foundUser._id)

  context.send(201, {
    message: `User ${userName}: ${userMail} deleted`
  })
})

app.use(router.routes())
