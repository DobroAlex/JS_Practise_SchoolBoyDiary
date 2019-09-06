const Router = require('koa-router')
const validator = require('../validator')
const bcrypt = require('bcrypt')
const ajv = require('../ajv-init')
const ajvSchems = require('../ajv-schems')
const User = require('../../models/user')
const utils = require('../utils')
const jwtUtils = require('../jwt-utils')
const router = new Router()

router.post('/public/register', async (context) => {
  await validator.validate(ajv, ajvSchems.REGISTER_USER_SCHEMA, context.request.body)

  const hashedPass = await bcrypt.hash(context.request.body.password, utils.HASH_ROUNDS)

  const requestBody = context.request.body

  await validator.ValidateFreeEmail(User, requestBody.email)

  const newUser = new User({
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

router.post('/public/login', async (context) => {
  const foundUser = await User.findOne({ email: context.request.body.email }, 'fullName password email role')
  if (!foundUser) {
    throw utils.errorGenerator(`No user ${context.request.body.email} has been found`, 404)
  }

  if (await bcrypt.compare(context.request.body.password, foundUser.password)) {
    const token = jwtUtils.newAccessToken({
      email: context.request.body.email,
      role: foundUser.role
    })
    const refreshToken = jwtUtils.newRefreshToken({
      email: context.request.body.email,
      role: foundUser.role
    }, jwtUtils.defaultRefreshExpireTime)

    foundUser.refreshToken = refreshToken
    await foundUser.save()

    context.send(200, {
      token: token,
      refreshToken: refreshToken
    })
  } else {
    throw utils.errorGenerator('Incorrect passwrod', 403)
  }
})
module.exports = router
