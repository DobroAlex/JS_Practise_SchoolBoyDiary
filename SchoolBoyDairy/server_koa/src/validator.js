const utils = require('./utils')

module.exports = {
  validate: async function (ajvInstance, schema, data) {
    if (ajvInstance.validate(schema, data)) {
      return true
    }

    throw utils.errorGenerator(ajvInstance.errorsText(), 400)
  },

  validateID: async function (Model, id) {
    if (id == null) {
      throw utils.errorGenerator(`ID ${id} is undefined. probably wasn\'t created OR already deleted`, 404)
    }
    try {
      const res = !!await Model.findById(id)
      if (!res) {
        throw new Error()
      }
    } catch (error) {
      throw utils.errorGenerator(`No such user with id: ${id}`, 404)
    }
  },

  ValidateFreeEmail: async function (Model, email) {
    const count = await Model.countDocuments({ email: email })
    if (!count) {
      return true
    } else {
      throw utils.errorGenerator(`E-mail ${email} has already been taken`, 422) // https://stackoverflow.com/questions/6123425/rest-response-code-for-invalid-data
    }
  },

  validateEmail: async function (Model, email) {
    const count = await Model.countDocuments({ email: email })
    if (count) {
      return true
    } else {
      throw utils.errorGenerator(`No user with ${email} has been found, probably deleted or wasn't created`, 404)
    }
  }
}
