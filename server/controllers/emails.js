const { emailConfig } = require('../configuration');
const mailgun = require('mailgun-js')({
  apiKey: emailConfig.EMAIL_API_KEY, 
  domain: emailConfig.EMAIL_DOMAIN
});

const { isValidObjectId } = require('../helpers/controller_helper');
const errorHelpers = require('../helpers/error_helper');

const EmailTemplate = require('../models/email/email_template');

module.exports = {
  createEmailTemplate: async (req, res) => {
    const { name, subject, text } = req.value.body;
    const foundTemplate = await EmailTemplate.findOne({ name });
    if(foundTemplate) { errorHelpers.emailTemplate.alreadyExists(res) }
    const createTemplate = await EmailTemplate.create({ name, subject, text });
    if(!createTemplate) { errorHelpers.emailTemplate.couldNotCreate(res) }
    res.status(200).json({ 
      success: true, 
      message: 'Successfully created email template', 
      data: createTemplate}
    );
  },
  editEmailTemplate: async (req, res) => {
    const { templateId } = req.value.params;
    if(!isValidObjectId(templateId)) { errorHelpers.timesheet.invalidId(res) }
    const foundTemplate = await EmailTemplate.findOne({ _id: templateId });
    if(!foundTemplate || foundTemplate.length === 0) { errorHelpers.emailTemplate.doesNotExist(res) }
    const updateObject = req.value.body;
    const updateTemplate = await EmailTemplate.findByIdAndUpdate(templateId, updateObject, { new: true });
    if(!updateTemplate) { errorHelpers.emailTemplate.couldNotUpdate(res) }
    res.status(200).json({
      success: true, 
      message: 'Email template successfully updated', 
      data: updateTemplate }
    );
  },
  deleteEmailTemplate: async (req, res) => {
    const { templateId } = req.value.params;
    if(!isValidObjectId(templateId)) { errorHelpers.timesheet.invalidId(res) }
    const deleteTemplate = await EmailTemplate.findByIdAndDelete({ _id: templateId });
    if(!deleteTemplate) { errorHelpers.emailTemplate.couldNotDelete(res) }
    res.status(200).json({
      success: true,
      message: 'Successfully deleted the template'
    });
  },
  sendEmail: async (req, res) => {
    let { 
      template,
      firstName,
      lastName,
      emailTo
    } = req.value.body;

    const foundTemplate = await EmailTemplate.findOne({ name: template });
    if(!foundTemplate) {
      errorHelpers.sendEmail.doesNotExist(res);
    }
    var data = {
      from: `${emailConfig.TIMESHEET_FROM} <${emailConfig.TIMESHEET_EMAIL}>`,
      to: `${firstName} ${lastName} <${emailTo}>`,
      subject: foundTemplate.subject,
      text: foundTemplate.text,
    };
    
    const sendEmail = await mailgun.messages().send(data);
    if(!sendEmail) { errorHelpers.sendEmail.couldNotSend(res) }
    res.status(200).json({ success: true, message: 'Email successfully sent', data });
  }
};
