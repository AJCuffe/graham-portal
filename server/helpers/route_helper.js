const Joi = require('joi');

module.exports = {
  validateBody: schema => (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(400).json(result.error);
    }
    if (!req.value) {
      req.value = {};
    }
    req.value.body = result.value;
    return next();
  },
  validateParams: schema => (req, res, next) => {
    const result = Joi.validate(req.params, schema);
    if (result.error) {
      return res.status(400).json(result.error);
    }
    if (!req.value) {
      req.value = {};
    }
    req.value.params = result.value;
    return next();
  },
  bodySchemas: {
    user: {
      signup: Joi.object().keys({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required(),
      }),
      auth: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      }),
    },
    project: {
      createProject: Joi.object().keys({
        pinNumber: Joi.string().required(),
        projectName: Joi.string().required(),
        packageId: Joi.string().required(),
        active: Joi.boolean().required(),
      }),
      updateProject: Joi.object().keys({
        pinNumber: Joi.string(),
        projectName: Joi.string(),
        active: Joi.boolean(),
      }),
      deleteProject: Joi.object().keys({
        projectId: Joi.string().required(),
      }),
    },
    package: {
      createPackage: Joi.object().keys({
        packageName: Joi.string().required(),
        packageCode: Joi.string().required(),
      }),
      updatePackage: Joi.object().keys({
        packageName: Joi.string(),
        packageCode: Joi.string(),
      }),
      deletePackage: Joi.object().keys({
        packageCode: Joi.string().required(),
      }),
    },
    role: {
      createRole: Joi.object().keys({
        roleName: Joi.string().required(),
        roleNote: Joi.string(),
      }),
      deleteRole: Joi.object().keys({
        roleId: Joi.string().required(),
      }),
      updateRole: Joi.object().keys({
        roleName: Joi.string(),
        roleNote: Joi.string(),
      }),
    },
    userRole: {
      assignRole: Joi.object().keys({
        roleId: Joi.string().required(),
      }),
    },
    timesheet: {
      createTimesheet: Joi.object().keys({
        userId: Joi.string().required(),
        weekEnding: Joi.date().required(),
        bookedHours: Joi.array().required(),
        totalHours: Joi.number(),
        locked: Joi.boolean().default(false),
        submitted: Joi.boolean().default(false),
        approved: Joi.boolean().default(false),
        rejected: Joi.boolean().default(false),
      }),
      updateTimesheet: Joi.object().keys({
        weekEnding: Joi.date(),
        bookedHours: Joi.array(),
      }),
    },
    emailTemplate: {
      createNew: Joi.object().keys({
        name: Joi.string().required(),
        subject: Joi.string().required(),
        text: Joi.string().required(),
      }),
    },
    email: {
      send: Joi.object().keys({
        template: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        emailTo: Joi.string().email().required(),
      }),
    },
  },
  paramsSchemas: {
    user: {
      readUserById: Joi.object().keys({
        userId: Joi.string().required(),
      }),
    },
    package: {
      readPackage: Joi.object().keys({
        packageId: Joi.string().required(),
      }),
      readPackageByCode: Joi.object().keys({
        packageCode: Joi.string().required(),
      }),
      updatePackage: Joi.object().keys({
        packageId: Joi.string().required(),
      }),
    },
    project: {
      readProjectById: Joi.object().keys({
        projectId: Joi.string().required(),
      }),
      readProjectsByPackageCode: Joi.object().keys({
        packageCode: Joi.string().required(),
      }),
      readProjectsByCodeAndActiveStatus: Joi.object().keys({
        packageCode: Joi.string().required(),
        active: Joi.string().required(),
      }),
      updateProject: Joi.object().keys({
        projectId: Joi.string().required(),
      }),
    },
    role: {
      readRoleById: Joi.object().keys({
        roleId: Joi.string().required(),
      }),
      updateRole: Joi.object().keys({
        roleId: Joi.string().required(),
      }),
    },
    userRole: {
      assignRole: Joi.object().keys({
        userId: Joi.string().required(),
      }),
      getRoles: Joi.object().keys({
        userId: Joi.string().required(),
      }),
    },
    timesheet: {
      readTimesheetByUserIdWeekEnding: Joi.object().keys({
        userId: Joi.string().required(),
        weekEnding: Joi.string().required(),
      }),
      readTimesheetById: Joi.object().keys({
        timesheetId: Joi.string().required(),
      }),
      readTimesheetByUserId: Joi.object().keys({
        userId: Joi.string().required(),
      }),
      updateTimesheet: Joi.object().keys({
        timesheetId: Joi.string().required(),
      }),
      lockTimesheet: Joi.object().keys({
        timesheetId: Joi.string().required(),
      }),
      readRejectedByUnix: Joi.object().keys({
        weekEndingUnix: Joi.number().required(),
      }),
      readApprovedByUnix: Joi.object().keys({
        weekEndingUnix: Joi.number().required(),
      }),
      readSubmittedByUnix: Joi.object().keys({
        weekEndingUnix: Joi.number().required(),
      }),
      readLockedByUnix: Joi.object().keys({
        weekEndingUnix: Joi.number().required(),
      }),
      readUnlockedByUnix: Joi.object().keys({
        weekEndingUnix: Joi.number().required(),
      }),
    }
  },
};
