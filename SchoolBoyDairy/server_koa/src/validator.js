module.exports = {
  validate: async function (ajvInstance, schema, data, context, statusCode = 400) {
    if (ajvInstance.validate(schema, data)) {
      return true
    }

    context.status = statusCode
    throw new Error(`${ajvInstance.errorsText()}`)
  },

  validateID: async function (Model, id, context) {
    if (id == null) {
      context = 404
      throw new Error('ID is undefined. probably wasn\'t created OR already deleted ')
    }
    try {
      const res = !!await Model.findById(id)
      if (!res) {
        throw new Error()
      }
    } catch (error) {
      throw new Error(`No such user with id: ${id}`)
    }
  },

  ValidateFreeEmail: async function (Model, email, context) {
    const count = await Model.countDocuments({ email: email })
    if (!count) {
      return true
    } else {
      context.status = 422
      throw new Error(`E-mail ${email} has already been taken`)
    }
  },

  validateEmail: async function (Model, email, context) {
    const count = await Model.countDocuments({ email: email })
    if (count) {
      return true
    } else {
      context.status = 404
      throw new Error(`No user with ${email} has been found, probably deleted or wasn't created`)
    }
  }
}
