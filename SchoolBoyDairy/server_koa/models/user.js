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
  role: String // either user or admin
})

const BlackListSchema = new Schema({
  token: String
},
{
  timestamps: {
    createdAt: 'created_at' } }
)
BlackListSchema.methods.add = async function (token) {
  await TokenBlackList.save({ token: token })
}

const TokenBlackList = mongoose.model('BlackList', BlackListSchema)
const User = mongoose.model('User', UserSchmea)
module.exports = { User, TokenBlackList }
