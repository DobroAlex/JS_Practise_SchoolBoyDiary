const Router = require('koa-router')
const validator = require('../validator')
const ajvUtils = require('../libs/ajv')
const User = require('../models/user')
const utils = require('../utils')
const jwtUtils = require('../jwt-utils')
const router = new Router()

router.post('/me/checkToken', async (context) => {
  await jwtUtils.verifyAccessToken(context.request.body.token)
  context.ok({ token: 'OK' })
})

router.post('/me/checkRefreshToken', async (context) => {
  await jwtUtils.verifyAccessToken(context.request.body.refreshToken, jwtUtils.defaultRefreshExpireTime)
  context.ok({ refreshToken: 'OK' })
})

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

router.get('/me', async (context) => { // rout is used to get user
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))

  await validator.validate(ajvUtils.JWT_TOKEN_SCHEMA, decoded)

  const foundUser = await User.findOne({ email: decoded.email }, 'fullName description school class email phoneNumber role lessons homeTasks')

  context.ok(foundUser)
})

router.put('/me', async (context) => { // rout is used to save user after modification on front-end
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))
  await validator.validate(ajvUtils.JWT_TOKEN_SCHEMA, decoded) // validating token

  await validator.validate(ajvUtils.PUT_ME_SCHEMA, context.request.body) // validating request body

  const foundUser = await User.findOne({ email: decoded.email }, '')
  let requestBody = context.request.body

  foundUser.fullName = requestBody.fullName
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

  const foundUser = await User.findOneAndDelete({ email: decoded.email })
  const userName = foundUser.fullName
  const userMail = foundUser.email

  context.send(201, {
    message: `User ${userName}: ${userMail} deleted`
  })
})

module.exports = router
