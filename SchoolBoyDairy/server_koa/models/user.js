const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchmea = new Schema({
  fullName: String,
  description: String,
  school: String,
  class: String,
  phoneNumber: String,
  mail: String,
  password: String, // should be stored like bcrypt.hash(plainTextPassword, utils.HashRound). DON'T save plaintext
  role: String // either user or admin
})

const User = mongoose.model('User', UserSchmea)
module.exports = User
