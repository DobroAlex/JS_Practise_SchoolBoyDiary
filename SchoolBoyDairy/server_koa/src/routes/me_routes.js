const Router = require('koa-router')
const validator = require('../validator')
const ajv = require('../ajv_init')
const ajvSchems = require('../ajv-schems')
const User = require('../../models/user')
const utils = require('../utils')
const jwtUtils = require('../jwt-utils')
const router = new Router()

router.post('/me/refresh', async (context) => {
  const decoded = await jwtUtils.verifyAccessToken(context.request.body.refreshToken, jwtUtils.defaultRefreshExpireTime)
  const foundUser = await User.findOne({ email: decoded.email })

  if (!foundUser || (context.request.body.refreshToken !== foundUser.refreshToken)) {
    throw utils.errorGenerator('Both token and refresh token expired, log in again', 401)
  }
  const token = jwtUtils.newAccessToken({
    email: foundUser.email,
    role: foundUser.role
  })
  const refreshToken = jwtUtils.newRefreshToken({
    email: foundUser.email,
    role: foundUser.role
  })

  foundUser.refreshToken = refreshToken
  await foundUser.save()

  context.ok({
    token: token,
    refreshToken: refreshToken
  })
})

router.get('/me', async (context) => {
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))

  await validator.validate(ajv, ajvSchems.JWT_TOKEN_SCHEMA, decoded)

  const foundUser = await User.findOne({ email: decoded.email }, 'fullName description school class email phoneNumber')

  context.ok(foundUser)
})

router.put('/me', async (context) => {
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
  foundUser.phoneNumber = requestBody.phoneNumber

  await foundUser.save()

  context.ok({
    message: `User ${foundUser.fullName} : ${foundUser.email} updated`
  })
})

router.delete('/me', async (context) => { // user wants to delete self
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

module.exports = router
