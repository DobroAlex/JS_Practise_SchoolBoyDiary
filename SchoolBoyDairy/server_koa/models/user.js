const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchmea = new Schema({
  fullName: String,
  description: String,
  school: String,
  class: String,
  phoneNumber: String,
  email: String,
  password: String, // should be stored like bcrypt.hash(plainTextPassword, utils.HashRound). DON'T save plaintext
  role: String, // either user or admin
  refreshToken: String,
  lessons: [{ // lesson date and state aka 'visited', 'missed', 'unpaid'
    date: Date,
    state: String
  }],
  homeTasks: [{ // home task in format of date, task aka simple string and state aka 'done', 'missed' or 'done partialy'
    date: Date,
    task: String,
    state: String
  }]
})

const User = mongoose.model('User', UserSchmea)
module.exports = User
