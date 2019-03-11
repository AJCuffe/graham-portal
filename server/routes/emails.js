const router = require('express-promise-router')();
const EmailController = require('../controllers/emails');

const { validateBody, bodySchemas } = require('../helpers/route_helper');

router.route('/').post(validateBody(bodySchemas.email.send), EmailController.sendEmail);

router.route('/templates').post(validateBody(bodySchemas.emailTemplate.createNew), EmailController.createEmailTemplate);

module.exports = router;