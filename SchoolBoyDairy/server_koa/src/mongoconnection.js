const mongoose = require('mongoose')
module.exports = {
  MONGO_ADDRESS: 'mongodb://localhost:27017/users',
  connectToMongo: function (address) {
    mongoose.connect(address).then(
      () => { const db = mongoose.connection; return db }, // on success
      err => { console.log(err); throw new Error('Unable to connect to db') } // this shouldn't happen normally if your mongoDB is online
    )
  }
}
