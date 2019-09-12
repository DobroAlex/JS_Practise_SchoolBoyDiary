const validator = require('../libs/validator')
const ajvUtils = require('../libs/ajv')
const User = require('../models/user')
const utils = require('../libs/utils')
const jwtUtils = require('../libs/jwt-utils')
const _ = require('lodash')

async function checkToken (context, next) {
  await jwtUtils.verifyAccessToken(context.request.body.token)
  context.ok({ token: 'OK' })
}

async function checkRefreshToken (context, next) {
  await jwtUtils.verifyAccessToken(context.request.body.refreshToken, jwtUtils.defaultRefreshExpireTime)
  context.ok({ refreshToken: 'OK' })
}

async function refreshMe (context, next) {
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
}

async function getMe (context, next) {
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))

  await validator.validate(ajvUtils.JWT_TOKEN_SCHEMA, decoded)

  const foundUser = await User.findOne({ email: decoded.email }, 'fullName description school class email phoneNumber role lessons homeTasks')

  context.ok(foundUser)
}

async function putMe (context, next) {
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))
  await validator.validate(ajvUtils.JWT_TOKEN_SCHEMA, decoded) // validating token

  await validator.validate(ajvUtils.PUT_ME_SCHEMA, context.request.body) // validating request body

  let foundUser = await User.findOne({ email: decoded.email }, '')

  foundUser = _.assign(foundUser, context.request.body)
  await foundUser.save()

  context.ok({
    message: `User ${foundUser.fullName} : ${foundUser.email} updated`
  })
}

async function deleteMe (context, next) {
  const decoded = jwtUtils.verifyAccessToken(jwtUtils.getTokenFromHeader(context))

  await validator.validateEmail(User, decoded.email)

  const foundUser = await User.findOneAndDelete({ email: decoded.email })
  const userName = foundUser.fullName
  const userMail = foundUser.email

  context.send(201, {
    message: `User ${userName}: ${userMail} deleted`
  })
}

module.exports = { checkToken, checkRefreshToken, refreshMe, getMe, putMe, deleteMe }
