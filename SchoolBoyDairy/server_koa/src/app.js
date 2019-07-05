const koa = require('koa')
const bodyParser = require('koa-bodyparser')
// const cors = require('cors');
const logger = require('koa-morgan')
const mongoose = require('mongoose')
const koaRouter = require('koa-router')
const koaRespond = require('koa-respond')
const utils = require('./utils')
const app = new koa()
const router = new koaRouter()
const User = require('../models/user')
app.use(logger('dev'))
app.use(bodyParser())
app.use(koaRespond())
// app.use(cors());
const server = app.listen(8081 || process.env.PORT)
console.log(`Server is listening to ${server.address().port} `)

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
    // TODO: rework to handle different situations and notify user accordingly
    console.error(`Error occured: \n ${error}`)
    context.internalServerError(error.message)
  }
})

router.get('/users', async (context, next) => {
  const foundUsers = await User.find({}, 'fullName description').sort({ _id: -1 })
  context.ok({ users: foundUsers })
})

router.post('/users', async (context, next) => {
  // TODO: add check for bad request (no fullName & description).If occured, throw exception
  if (utils.IsStingNullOrEmpty(context.request.body.fullName) || utils.IsStingNullOrEmpty(context.request.body.description)) {
    // throw new Error('No name OR description provided')
  }

  let fullName = context.request.body.fullName
  let description = context.request.body.description
  let newUser = new User({
    fullName: fullName,
    description: description
  })
  await newUser.save()
  context.send(201, {
    message: `User ${fullName} saved successfuly`
  })
})

router.get('/users/:id', async (context, next) => {
  const foundUser = await User.findById(context.params.id, 'fullName description')
  if (!foundUser) {
    context.notFound()
  } else {
    context.ok(foundUser)
  }
})

router.put('/users/:id', async (context, next) => {
  if (utils.IsStingNullOrEmpty(context.request.body.fullName) || utils.IsStingNullOrEmpty(context.request.body.description)) {
    throw new Error('No name OR description provided \n User probably was deleted or wasn\'t created at all')
  }
  const foundUser = await User.findById(context.params.id, 'fullName description')
  if (!foundUser) {
    context.notFound()
  }
  foundUser.fullName = context.request.body.fullName
  foundUser.description = context.request.body.description
  foundUser.save()
  context.ok({
    message: `User ${foundUser.fullName} updated`
  })
})

router.delete('/users/:id', async (context, next) => {
  if (await User.count({ _id: context.params.id }) === 0) {
    context.notFound()
    return
  }
  let foundUser = await User.findById(context.params.id)
  let userName = foundUser.fullName
  await User.findByIdAndDelete(context.params.id)
  context.send(201, {
    message: `User ${userName} deleted`
  })
})

app.use(router.routes())
