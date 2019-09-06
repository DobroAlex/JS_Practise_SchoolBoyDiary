module.exports = {
  errorHandlerMiddle: async function (context, next) {
    try {
      await next()
    } catch (error) {
      console.error(`Error occured: \n ${error} \n ${error.stack}`)
      if (error.status) {
        context.status = error.status
      }
      context.send(context.status, `${error}`)
    }
  }
}
