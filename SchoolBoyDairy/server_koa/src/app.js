const koa = require('koa')
const bodyParser = require('koa-bodyparser')
// const cors = require('cors');
const logger = require('koa-morgan')
const mongoose = require('mongoose')
const koaRouter = require('koa-router')
const koaRespond = require('koa-respond')
const app = new koa()
const router = new koaRouter()
const User = require('../models/user')
app.use(logger('dev'))
app.use(bodyParser())
app.use(koaRespond())
// app.use(cors());
const server = app.listen(8081 || process.env.PORT)
console.log(`Server is listening to ${server.address().port} `)

let db
mongoose.connect('mongodb://localhost:27017/users').then(
  () => { db = mongoose.connection; console.log('Successfully connected to db') },
  err => { console.log(err); console.error('Unable to connect to db, shutting down the server'); server.close() } // this shouldn't happen normally if your mongoDB is online
)

app.use(async function handleError (context, next) {
  try {
    await next()
  } catch (error) {
    // TODO: rework to handle different situations and notify user accordingly
    console.error(`Error occured: \n ${error}`)
    context.status = 500
    context.body = error
  }
})

router.get('/users', async (context, next) => {
  const foundUsers = await User.find({}, 'fullName description').sort({ _id: -1 })
  context.ok({ users: foundUsers })
  return next()
})

router.post('/users', async (context, next) => {
  let fullName = context.request.body.fullName
  let description = context.request.body.description
  let newUser = new User({
    fullName: fullName,
    description: description
  })
  await newUser.save()
  context.send(201, {
    success: true,
    message: `User ${fullName} saved successfuly`
  })
  return next()
})

router.put('/users/:id', async (context, next) => {
  const foundUser = await User.findById(context.request._id, 'fullName description')
  foundUser.fullName = context.request.body.fullName
  foundUser.description = context.request.body.description
  foundUser.save()
  context.respond.send({
    success: true
  })
})
app.use(router.routes())
