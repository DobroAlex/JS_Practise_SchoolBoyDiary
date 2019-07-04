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
  context.response.body = ({ users: foundUsers })
  return next()
})

app.use(router.routes())
