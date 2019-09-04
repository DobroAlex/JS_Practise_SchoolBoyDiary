const Router = require('koa-router')
const validator = require('../validator')
const ajv = require('../ajv_init')
const ajvSchems = require('../ajv-schems')
const User = require('../../models/user')
const jwtUtils = require('../jwt-utils')

const router = new Router()

router.get('/admin/users', async (context) => {
  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  const foundUsers = await User.find({}).sort({ email: -1 }) // Get all of them

  context.ok({ users: foundUsers })
})

router.post('/admin/users', async (context) => {
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

router.get('/admin/users/:id', async (context) => {
  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  await validator.validateID(User, context.params.id, context)

  const foundUser = await User.findById(context.params.id, '')

  context.ok({ user: foundUser })
})

router.put('/admin/users/', async (context) => {
  const requestBody = context.request.body

  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  await validator.validateEmail(User, requestBody.email) // ensuring that given user exists

  await validator.validate(ajv, ajvSchems.PUT_ME_SCHEMA, requestBody)

  const foundUser = await User.findOne({ email: requestBody.email }, '')

  foundUser.fullName = requestBody.fullName
  foundUser.description = requestBody.description
  foundUser.school = requestBody.school
  foundUser.class = requestBody.class
  foundUser.phoneNumber = requestBody.phoneNumber
  foundUser.role = requestBody.role // admin may change any user role
  foundUser.lessons = requestBody.lessons
  foundUser.homeTasks = requestBody.homeTasks

  await foundUser.save()

  context.ok({
    message: `User ${requestBody.fullName}: ${requestBody.email} updated`
  })
})

router.delete('/admin/users', async (context) => { // admin wants to delete user
  await jwtUtils.validateAdminRoleAndToken(context, ajv)

  await validator.validate(ajv, ajvSchems.DELETE_USERS_EMAIL_SCHEMA, context.request.body)

  const targetEmail = context.request.body.email

  await validator.validateEmail(User, targetEmail)

  const foundUser = await User.findOneAndDelete({ email: targetEmail })

  context.send(201, {
    message: `User ${foundUser.fullName}: ${foundUser.emit} deleted`
  })
})

module.exports = router
