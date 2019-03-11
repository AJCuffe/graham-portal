const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    packageName: {
        type: String,
        required: true
    },
    packageCode: {
        type: String,
        required: true
    }
});

const Package = mongoose.model('package', packageSchema);

module.exports = Package;