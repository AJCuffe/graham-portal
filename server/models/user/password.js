const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    passwordQuestion: {
        type: String
    },
    passwordAnswer: {
        type: String
    }
});


passwordSchema.pre('save', async function(next) {
  // fat arrow not used as we need access to 'this' scope
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Generate a password hash (salt + hash)
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

passwordSchema.methods.isValidPassword = async function(password, inputtedPassword) {
  try {
    return await bcrypt.compare(inputtedPassword, password);
  } catch (error) {
    throw new Error(error);
  }
}


const Password = mongoose.model('password', passwordSchema);

module.exports = Password;