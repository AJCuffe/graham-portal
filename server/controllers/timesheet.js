/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const _ = require('lodash');
const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const { timesheetSchema, Timesheet } = require('../models/timesheet/timesheet');

timesheetSchema.plugin(deepPopulate);

const { isValidObjectId } = require('../helpers/controller_helper');
const errorHelper = require('../helpers/error_helper');

const { timesheetConfig } = require('../configuration');

module.exports = {
  createTimesheet: async (req, res) => {
    const {
      userId,
      weekEnding,
      bookedHours,
      totalHours,
    } = req.value.body;

    if (!isValidObjectId(userId)) { errorHelper.user.invalidId(res); }

    // Ensure that every day has hours booked against it
    _.forEach(bookedHours, (booking) => {
      if (!Number.isInteger(booking.mon) || !Number.isInteger(booking.tue)
      || !Number.isInteger(booking.wed) || !Number.isInteger(booking.thu)
      || !Number.isInteger(booking.fri) || !Number.isInteger(booking.sat)
      || !Number.isInteger(booking.sun)) {
        errorHelper.timesheet.ensureHoursBookedForAllDays(res);
      }
    });

    // If timesheet already exists for that week by that user, produce an error
    const foundTimesheet = await Timesheet.find({ userId, weekEnding });
    if (foundTimesheet.length === 1) {
      errorHelper.timesheet.alreadyExistsForWeekEnding(res);
    }

    // TODO: Prevent user from adding two of the same projects

    // Attempt to write new time booking into the database
    const newTimeBooking = new Timesheet({
      userId, weekEnding, bookedHours, totalHours,
    });

    await newTimeBooking.save();

    if (!newTimeBooking) { errorHelper.timesheet.couldNotCreate(res); }
    return res.status(200).json({ success: true, data: newTimeBooking });
  },
  readTimesheetByUserIdWeekending: async (req, res) => {
    const { userId, weekEnding } = req.value.params;
    if (!isValidObjectId(userId)) { errorHelper.userId.invalidId(res); }
    // Check to ensure that weekEnding date given is a number
    const pattern = /^-?\d+\.?\d*$/;
    if (pattern.test(weekEnding) === false) {
      errorHelper.timesheet.nonIntegerDate(res);
    }
    const foundTimesheet = await Timesheet.find({ userId, weekEnding })
      .deepPopulate('bookedHours.projectId bookedHours.projectId.package');
    if (!foundTimesheet || foundTimesheet.length === 0) {
      errorHelper.timesheet.noTimesheetFound(res);
    }
    return res.status(200).json({ success: true, data: foundTimesheet });
  },
  readTimesheetByUserId: async (req, res) => {
    const { userId } = req.value.params;
    if (!isValidObjectId(userId)) { errorHelper.user.invalidId(res); }
    const foundTimesheets = await Timesheet.find({ userId })
      .deepPopulate('bookedHours.projectId bookedHours.projectId.package');
    if (!foundTimesheets || foundTimesheets.length === 0) {
      errorHelper.timesheet.noTimesheetFound(res);
    }
    return res.status(200).json({ success: true, data: foundTimesheets });
  },
  readTimesheetByTimesheetId: async (req, res) => {
    const { timesheetId } = req.value.params;
    if (!isValidObjectId(timesheetId)) { errorHelper.timesheet.invalidId(res); }
    const foundTimesheets = await Timesheet.find({ _id: timesheetId })
      .deepPopulate('bookedHours.projectId bookedHours.projectId.package userId');
    if (!foundTimesheets || foundTimesheets.length === 0) {
      errorHelper.timesheet.invalidTimesheetId(res);
    }
    return res.status(200).json({ success: true, data: foundTimesheets });
  },
  readTimesheetByRejectedStatus: async (req, res) => {
    const weekEndingUnix = null;
    if (req.value !== undefined) {
      const { weekEndingUnix } = req.value.params;
    }
    let foundTimesheets = null;
    if (weekEndingUnix !== null) {
      foundTimesheets = await Timesheet.find({ rejected: true, weekEndingUnix });
    } else {
      foundTimesheets = await Timesheet.find({ rejected: true });
    }
    if (!foundTimesheets || foundTimesheets.length === 0) {
      errorHelper.timesheet.noTimesheetsWithRejectedStatus(res);
    }
    return res.status(200).json({ success: true, data: foundTimesheets });
  },
  readTimesheetByApprovedStatus: async (req, res) => {
    const weekEndingUnix = null;
    if (req.value !== undefined) {
      const { weekEndingUnix } = req.value.params;
    }
    const foundTimesheets = await Timesheet.find({ approved: true });
    if (weekEndingUnix !== null) {
      const foundTimesheets = await Timesheet.find({ approved: true, weekEndingUnix });
    }
    if (!foundTimesheets || foundTimesheets.length === 0) {
      errorHelper.timesheet.noTimesheetsWithApprovedStatus(res);
    }
    return res.status(200).json({ success: true, data: foundTimesheets });
  },
  readTimesheetBySubmittedStatus: async (req, res) => {
    if (req.value !== undefined) {
      const { weekEndingUnix } = req.value.params;
    }
    if (weekEndingUnix !== null) {
      foundTimesheets = await Timesheet.find({
        submitted: true, weekEndingUnix,
      });
    } else {
      foundTimesheets = await Timesheet.find({ submitted: true });
    }
    if (!foundTimesheets || foundTimesheets.length === 0) {
      errorHelper.timesheet.noTimesheetsWithSubmittedStatus(res);
    }
    return res.status(200).json({ success: true, data: foundTimesheets });
  },
  readTimesheetByLockedStatus: async (req, res) => {
    const weekEndingUnix = null;
    if (req.value !== undefined) {
      const { weekEndingUnix } = req.value.params;
    }
    if (weekEndingUnix !== null) {
      foundTimesheets = await Timesheet.find({ locked: true, weekEndingUnix });
    } else {
      foundTimesheets = await Timesheet.find({ locked: true });
    }
    if (!foundTimesheets || foundTimesheets.length === 0) {
      errorHelper.timesheet.noTimesheetsWithLockedStatus(res);
    }
    return res.status(200).json({ success: true, data: foundTimesheets });
  },
  readTimesheetByUnlockedStatus: async (req, res) => {
    const weekEndingUnix = null;
    if (req.value !== undefined) {
      const { weekEndingUnix } = req.value.params;
    }
    if (weekEndingUnix !== null) {
      foundTimesheets = await Timesheet.find({ locked: false, weekEndingUnix });
    } else {
      foundTimesheets = await Timesheet.find({ locked: false });
    }
    if (!foundTimesheets || foundTimesheets.length === 0) {
      errorHelper.timesheet.noTimesheetsWithUnlockedStatus(res);
    }
    return res.status(200).json({ success: true, data: foundTimesheets });
  },
  updateTimesheet: async (req, res) => {
    const { timesheetId } = req.value.params;
    if (!isValidObjectId(timesheetId)) {
      errorHelper.timesheet.invalidId(res);
    }
    const updateObject = req.value.body;

    const totalHoursPerDay = {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
    };

    _.forEach(updateObject.bookedHours, (booking) => {
      if (!isValidObjectId(booking.projectId)) {
        errorHelper.project.invalidId(res);
      }

      // Check hours are valid integers
      if (!Number.isInteger(booking.mon) || !Number.isInteger(booking.tue)
      || !Number.isInteger(booking.wed) || !Number.isInteger(booking.thu)
      || !Number.isInteger(booking.fri) || !Number.isInteger(booking.sat)
      || !Number.isInteger(booking.sun)) {
        errorHelper.timesheet.ensureHoursBookedAreNumeric(res);
      }

      // Check daily hours booked against each project to ensure
      // they are sensible
      _.forOwn(booking, (value, day) => {
        if (value < 0 || value > timesheetConfig.MAX_DAILY_WORKING_HOURS) {
          switch (day) {
            case 'mon':
              errorHelper.timesheet.checkHoursBooked(
                res, booking.projectId,
                timesheetConfig.MAX_DAILY_WORKING_HOURS, 'Monday',
              );
              break;
            case 'tue':
              errorHelper.timesheet.checkHoursBooked(
                res, booking.projectId,
                timesheetConfig.MAX_DAILY_WORKING_HOURS, 'Tuesday',
              );
              break;
            case 'wed':
              errorHelper.timesheet.checkHoursBooked(
                res, booking.projectId,
                timesheetConfig.MAX_DAILY_WORKING_HOURS, 'Wednesday',
              );
              break;
            case 'thu':
              errorHelper.timesheet.checkHoursBooked(
                res, booking.projectId,
                timesheetConfig.MAX_DAILY_WORKING_HOURS, 'Thursday',
              );
              break;
            case 'fri':
              errorHelper.timesheet.checkHoursBooked(
                res, booking.projectId,
                timesheetConfig.MAX_DAILY_WORKING_HOURS, 'Friday',
              );
              break;
            case 'sat':
              errorHelper.timesheet.checkHoursBooked(
                res, booking.projectId,
                timesheetConfig.MAX_DAILY_WORKING_HOURS, 'Saturday',
              );
              break;
            case 'sun':
              errorHelper.timesheet.checkHoursBooked(
                res, booking.projectId,
                timesheetConfig.MAX_DAILY_WORKING_HOURS, 'Sunday',
              );
              break;
            default:
          }
        }
      });

      // Store total hours booked per day across all projects
      totalHoursPerDay.mon += booking.mon;
      totalHoursPerDay.tue += booking.tue;
      totalHoursPerDay.wed += booking.wed;
      totalHoursPerDay.thu += booking.thu;
      totalHoursPerDay.fri += booking.fri;
      totalHoursPerDay.sat += booking.sat;
      totalHoursPerDay.sun += booking.sun;
    });

    // Now check total hours booked to make sure they do not exceed 24 hours
    _.forOwn(totalHoursPerDay, (value, day) => {
      if (value < 0 || value > 24) {
        switch (day) {
          case 'mon':
            errorHelper.timesheet.invalidTotal(res, 'Monday');
            break;
          case 'tue':
            errorHelper.timesheet.invalidTotal(res, 'Tuesday');
            break;
          case 'wed':
            errorHelper.timesheet.invalidTotal(res, 'Wednesday');
            break;
          case 'thu':
            errorHelper.timesheet.invalidTotal(res, 'Thursday');
            break;
          case 'fri':
            errorHelper.timesheet.invalidTotal(res, 'Friday');
            break;
          case 'sat':
            errorHelper.timesheet.invalidTotal(res, 'Saturday');
            break;
          case 'sun':
            errorHelper.timesheet.invalidTotal(res, 'Sunday');
            break;
          default:
        }
      }
    });

    // CHeck to see if timesheet exists and is ready for updating
    const foundTimesheet = await Timesheet.findOne({ _id: timesheetId });
    if (!foundTimesheet || foundTimesheet.length === 0) {
      errorHelper.timesheet.invalidTimesheetId(res);
    }

    // Update weekEndingUnix field
    if (updateObject.weekEnding !== null) {
      updateObject.weekEndingUnix = Date.parse(updateObject.weekEnding);
    }

    // Update totalHours field
    let grandTotalHours = 0;
    updateObject.bookedHours.forEach((booking) => {
      grandTotalHours += booking.mon + booking.tue + booking.wed
      + booking.thu + booking.fri + booking.sat + booking.sun;
    });
    updateObject.totalHours = grandTotalHours;
    updateObject.rejected = false;
    updateObject.approved = false;
    updateObject.submitted = false;
    updateObject.locked = false;

    // Finally, update the timesheet document and return it
    const updateTimesheet = await Timesheet
      .findByIdAndUpdate(timesheetId, updateObject, { new: true });
    if (!updateTimesheet) { errorHelper.timesheet.couldNotUpdate(res); }
    return res.status(200).json({ success: true, data: updateTimesheet });
  },
  deleteTimesheet: async (req, res) => {
    const { timesheetId } = req.value.params;

    if (!isValidObjectId(timesheetId)) {
      errorHelper.timesheet.invalidId(res);
    }

    const deleteTimesheet = Timesheet.findByIdAndDelete(timesheetId);
    if (!deleteTimesheet) { errorHelper.timesheet.errorDeleting(res); }
    return res.status(200).json({
      success: true,
      message: 'Timesheet was successfully deleted',
    });
  },
  lockTimesheet: async (req, res) => {
    const { timesheetId } = req.value.params;
    if (!isValidObjectId(timesheetId)) {
      errorHandler.timesheet.invalidTimesheetId(res);
    }
    const updateLockedStatus = await Timesheet.findByIdAndUpdate(timesheetId, { locked: true });
    if (!updateLockedStatus) { errorHandler.timesheet.couldNotLock(res); }
    return res.json({ success: true, message: 'Timesheet successfully locked' });
  },
  unlockTimesheet: async (req, res) => {
    const { timesheetId } = req.value.params;
    if (!isValidObjectId(timesheetId)) {
      errorHandler.timesheet.invalidTimesheetId(res);
    }
    const updateLockedStatus = await Timesheet.findByIdAndUpdate(timesheetId, { locked: false });
    if (!updateLockedStatus) { errorHandler.timesheet.couldNotUnlock(res); }
    return res.json({ success: true, message: 'Timesheet successfully unlocked' });
  },
  approveTimesheet: async (req, res) => {
    const { timesheetId } = req.value.params;
    if (!isValidObjectId(timesheetId)) {
      errorHandler.timesheet.invalidTimesheetId(res);
    }
    const updateApprovedStatus = await Timesheet.findByIdAndUpdate(
      timesheetId,
      { approved: true, rejected: false },
    );
    if (!updateApprovedStatus) { errorHandler.timesheet.couldNotApprove(res); }
    return res.json({ success: true, message: 'Timesheet successfully approved' });
  },
  rejectTimesheet: async (req, res) => {
    const { timesheetId } = req.value.params;
    if (!isValidObjectId(timesheetId)) {
      errorHandler.timesheet.invalidTimesheetId(res);
    }
    const updateApprovedRejectedStatus = await Timesheet.findByIdAndUpdate(
      timesheetId,
      { approved: false, rejected: true },
    );
    if (!updateApprovedRejectedStatus) { errorHandler.timesheet.couldNotReject(res); }
    return res.json({ success: true, message: 'Timesheet successfully rejected' });
  },
};
