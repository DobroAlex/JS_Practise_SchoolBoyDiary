// TODO Use extra empty line to emphasize 'require' logic blocs
// and rearrange 'require' blocks and function calls
const koa = require('koa')
const bodyParser = require('koa-bodyparser')
// const cors = require('cors');
const logger = require('koa-morgan')
const mongoose = require('mongoose')
const koaRouter = require('koa-router')
const koaRespond = require('koa-respond')
const jwt = require('koa-jwt')
const jsonwebtoken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const utils = require('./utils')
const validator = require('./validator')
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

// TODO better move mongo connection to separate file
const mongoAddress = 'mongodb://localhost:27017/users'
let db
mongoose.connect(mongoAddress).then(
  () => { db = mongoose.connection; console.log('Successfully connected to db') },
  err => { console.log(err); console.error('Unable to connect to db, shutting down the server'); server.close() } // this shouldn't happen normally if your mongoDB is online
)

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
  // TODO you may unite two validation functions. It will look better

  await validator.validate(ajv, ajvSchems.REGISTER_USER_SCHEMA, context.request.body, context)
  // TODO Use extra empty lines between logical code blocks. It is more readable
  const hashedPass = await bcrypt.hash(context.request.body.password, utils.HASH_ROUNDS)
  const requestBody = context.request.body // you may use destructuring for easier variables usage. Example below
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

// I did not test it. May contain bugs
// router.post('/public/register', async (context, next) => {
//   await validator.validate(ajv, ajvSchems.REGISTER_USER_SCHEMA, context.request.body, context)

//   const hashedPass = await bcrypt.hash(context.request.body.password, utils.HASH_ROUNDS)
//   const { fullName, school, mail } = context.request.body 

//   await validator.IsFreeEmail(User, email, context)

//   let newUser = new User({
//     fullName,
//     school,
//     mail,
//     password: hashedPass
//   })

//   await newUser.save()

//   context.send(201, {
//     message: `User ${fullName} (${email} saved)`
//   })
// })

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
