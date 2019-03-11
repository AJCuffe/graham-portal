const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  office: {
    type: mongoose.ObjectId,
  },
  telNumber: {
    type: String
  },
  jobTitle: {
    type: mongoose.ObjectId
  },
  role: {
    type: [{ type: Schema.Types.ObjectId, ref: 'role' }]
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;