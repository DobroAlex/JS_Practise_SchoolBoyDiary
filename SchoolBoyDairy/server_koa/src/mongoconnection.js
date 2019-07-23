const mongoose = require('mongoose')
module.exports = {
  MONGO_USERS_ADDRESS: 'mongodb://localhost:27016/users',

  connectToMongo: async function (address, server) {  //TODO: bad OOP
    try {
      return await mongoose.connect(address, { useNewUrlParser: true })
    } catch (e) {
      console.error(`Couldn't connect to mongo db at ${address}, you should abort execution`)
      server.close()
    }
  }
}
