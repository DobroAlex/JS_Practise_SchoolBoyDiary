const validator = require('../libs/validator')
const User = require('../models/user')
const jwtUtils = require('../libs/jwt-utils')
const ajvUtils = require('../libs/ajv')
const _ = require('lodash')

async function getUsers (context, next) {
  await jwtUtils.validateAdminRoleAndToken(context)

  const foundUsers = await User.find({}).sort({ email: -1 }) // Get all of them

  context.ok({ users: foundUsers })
}
async function putUser (context, next) {
  const requestBody = context.request.body

  await jwtUtils.validateAdminRoleAndToken(context)

  await validator.validateEmail(User, requestBody.email) // ensuring that given user exists

  await validator.validate(ajvUtils.PUT_ME_SCHEMA, requestBody)

  let foundUser = await User.findOne({ email: requestBody.email }, '')

  foundUser = _.assign(foundUser, requestBody)
  await foundUser.save()

  context.ok({
    message: `User ${requestBody.fullName}: ${requestBody.email} updated`
  })
}
async function deleteUser (context, next) {
  await jwtUtils.validateAdminRoleAndToken(context)

  await validator.validate(ajvUtils.DELETE_USERS_EMAIL_SCHEMA, context.request.body)

  const targetEmail = context.request.body.email

  await validator.validateEmail(User, targetEmail)

  const foundUser = await User.findOneAndDelete({ email: targetEmail })

  context.send(201, {
    message: `User ${foundUser.fullName}: ${foundUser.emit} deleted`
  })
}
async function postUser (context, next) {
  await jwtUtils.validateAdminRoleAndToken(context)

  await validator.validate(ajvUtils.POST_USER_SCHEMA, context.request.body)

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
}

module.exports = { getUsers, postUser, putUser, deleteUser }
