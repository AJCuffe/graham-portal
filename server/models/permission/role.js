const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    roleName: {
        type: String,
        required: true
    },
    roleNote: {
        type: String,
        default: null
    }
});

const Role = mongoose.model('role', roleSchema);

module.exports = Role;