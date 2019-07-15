module.exports = {
  validate: async function (ajvInstance, schema, data, context, statusCode = 400) {
    if (!ajvInstance.validate(schema, data)) {
      context.status = statusCode
      throw new Error(`${ajvInstance.errorsText()}`)
    } else {
      return true
    }
  }
}
