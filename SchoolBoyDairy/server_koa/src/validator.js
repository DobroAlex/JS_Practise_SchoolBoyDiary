module.exports = {
  validate: async function (ajvInstance, schema, data, context, statusCode = 400) {
    if (!ajvInstance.validate(schema, data)) {
      context.status = statusCode
      throw new Error(`${ajvInstance.errorsText()}`)
    } else {
      return true
    }
  },
  validateID: async function (Model, id, context) {
    try {
      return !!await Model.findById(id)
    } catch (error) {
      context.status = 404
      throw new Error(`No such user with id: ${id}`)
    }
  }
}
