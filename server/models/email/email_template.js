const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailTemplateSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true
  }
});

const EmailTemplate = mongoose.model('emailtemplate', emailTemplateSchema);

module.exports = EmailTemplate;