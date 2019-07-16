const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchmea = new Schema({
  fullName: String,
  description: String,
  school: String,
  class: String,
  phoneNumber: String,
  mail: String
})

const User = mongoose.model('User', UserSchmea)
module.exports = User
