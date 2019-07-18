module.exports = {
  validate: async function (ajvInstance, schema, data, context, statusCode = 400) {
    // TODO Here you first opposite condition you may get rid of extra code block. Like i`ve just done
    // Of course if there was no other cases which was processed in previous realization
    if (ajvInstance.validate(schema, data)) return true

    context.status = statusCode
    throw new Error(`${ajvInstance.errorsText()}`)
  },
  validateID: async function (Model, id, context) {
    try {
      return !!await Model.findById(id)
    } catch (error) {
      context.status = 404
      throw new Error(`No such user with id: ${id}`)
    }
  },
  IsFreeEmail: async function (Model, email, context) {
    const count = await Model.countDocuments({ mail: email })
    if (!count) {
      return true
    } else {
      context.error = 422
      throw new Error(`E-mail ${email} has already been taken`)
    }
  }
}
