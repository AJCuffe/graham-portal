const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginAttemptSchema = new Schema({
    accountName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    browserType: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    }
});

const LoginAttempt = mongoose.model('loginattempt', loginAttemptSchema);

module.exports = LoginAttempt;