const router = require('express-promise-router')();
const passport = require('passport');

const {
  validateBody,
  validateParams,
  bodySchemas,
  paramsSchemas,
} = require('../helpers/route_helper');

const TimesheetController = require('../controllers/timesheet');
const PDFController = require('../controllers/pdf_generate');

// eslint-disable-next-line no-unused-vars
const passportJWT = passport.authenticate('jwt', { session: false });

/*******************************************************************************************
*                                      POST ROUTES
********************************************************************************************/

// Create a new timesheet
router.route('/').post(
  validateBody(bodySchemas.timesheet.createTimesheet),
  TimesheetController.createTimesheet,
);

// Lock a timesheet by Timesheet ID
router.route('/lock/:timesheetId').post(
  validateParams(paramsSchemas.timesheet.lockTimesheet),
  TimesheetController.lockTimesheet,
);

// Unlock a timesheet by Timesheet ID
router.route('/unlock/:timesheetId').post(validateParams(
  paramsSchemas.timesheet.lockTimesheet), 
  TimesheetController.unlockTimesheet
);

// Approve a timesheet by Timesheet ID
router.route('/approve/:timesheetId').post(validateParams(
  paramsSchemas.timesheet.lockTimesheet), 
  TimesheetController.approveTimesheet
);

// Reject a timesheet by Timesheet ID
router.route('/reject/:timesheetId').post(validateParams(
  paramsSchemas.timesheet.lockTimesheet), 
  TimesheetController.rejectTimesheet
);

/*******************************************************************************************
*                                      GET ROUTES
********************************************************************************************/

// Get a timesheet by Timesheet ID
router.route('/id/:timesheetId').get(
  validateParams(paramsSchemas.timesheet.readTimesheetById),
  TimesheetController.readTimesheetByTimesheetId,
);

// Get all timesheets by User ID
router.route('/userid/:userId').get(
  validateParams(paramsSchemas.timesheet.readTimesheetByUserId),
  TimesheetController.readTimesheetByUserId,
);

// Get a specific timesheet for week ending date by User ID
router.route('/userid/:userId/:weekEnding').get(
  validateParams(paramsSchemas.timesheet.readTimesheetByUserIdWeekEnding),
  TimesheetController.readTimesheetByUserIdWeekending,
);

// Get all rejected timesheets
router.route('/rejected').get(TimesheetController.readTimesheetByRejectedStatus);

// Get all rejected timesheets for specific week ending date
router.route('/rejected/:weekEndingUnix').get(validateParams(
  paramsSchemas.timesheet.readRejectedByUnix), 
  TimesheetController.readTimesheetByRejectedStatus
);

// Get all approved timesheets
router.route('/approved').get(TimesheetController.readTimesheetByApprovedStatus);

// Get all approved timesheets for specific week ending date
router.route('/approved/:weekEndingUnix').get(
  validateParams(paramsSchemas.timesheet.readApprovedByUnix),
  TimesheetController.readTimesheetByApprovedStatus,
);

// Get all submitted timesheets
router.route('/submitted').get(TimesheetController.readTimesheetBySubmittedStatus);

// Get all submitted timesheets by specific week ending date
router.route('/submitted/:weekEndingUnix').get(
  validateParams(paramsSchemas.timesheet.readSubmittedByUnix),
  TimesheetController.readTimesheetBySubmittedStatus,
);

// Get all locked timesheets
router.route('/locked').get(TimesheetController.readTimesheetByLockedStatus);

// Get all locked timesheets for specific week ending date
router.route('/locked/:weekEndingUnix').get(
  validateParams(paramsSchemas.timesheet.readLockedByUnix), 
  TimesheetController.readTimesheetByLockedStatus
);

// Get all unlocked timesheets
router.route('/unlocked').get(TimesheetController.readTimesheetByUnlockedStatus);

// Get all unlocked timesheets for specific week ending date
router.route('/unlocked/:weekEndingUnix').get(
  validateParams(paramsSchemas.timesheet.readUnlockedByUnix),
  TimesheetController.readTimesheetByUnlockedStatus,
);

router.route('/pdf/:timesheetId').post(validateParams(
  paramsSchemas.timesheet.readTimesheetById), 
  validateBody(bodySchemas.timesheet.convertTimesheetToPDF), 
  PDFController.generate);

/*******************************************************************************************
*                                     PUT ROUTES
********************************************************************************************/

// Amend a timesheet already stored in database
router.route('/id/:timesheetId').put(
  validateParams(paramsSchemas.timesheet.updateTimesheet),
  validateBody(bodySchemas.timesheet.updateTimesheet), 
  TimesheetController.updateTimesheet,
);

/*******************************************************************************************
*                                    DELETE ROUTES
********************************************************************************************/

// Delete a timesheet by Timesheet ID
router.route('/id/:timesheetId').delete(validateParams(
  paramsSchemas.timesheet.updateTimesheet), 
  TimesheetController.deleteTimesheet
);

module.exports = router;
