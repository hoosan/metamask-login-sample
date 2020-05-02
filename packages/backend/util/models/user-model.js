const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

const UserSchema = new mongoose.Schema({
  id: Number,
  nonce: {
    type: Number,
    default: Math.floor(Math.random() * 1000000)
  },
  publicAddress: String
})

module.exports = mongoose.model('User', UserSchema);