const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

const { 
    validateBody, 
    validateParams, 
    bodySchemas, 
    paramsSchemas 
} = require('../helpers/route_helper');

const RoleController = require('../controllers/roles');
const UserRoleController = require('../controllers/user_roles');

const passportJWT = passport.authenticate('jwt', { session: false });

/*******************************************************************************************
*                                      POST ROUTES
********************************************************************************************/

// Create new Role
router.route('/')
  .post(validateBody(bodySchemas.role.createRole), RoleController.createRole);

// Assign a Role to a User ID
router.route('/assign/:userId')
  .post(validateBody(bodySchemas.userRole.assignRole), validateParams(paramsSchemas.userRole.assignRole),
  UserRoleController.assignRole);

// Revoke a Role from a User ID
router.route('/revoke/:userId')
  .post(validateBody(bodySchemas.userRole.assignRole), validateParams(paramsSchemas.userRole.assignRole),
  UserRoleController.revokeRole);

/*******************************************************************************************
*                                      GET ROUTES
********************************************************************************************/

// Get all Roles
router.route('/')
  .get(RoleController.readRoles);

// Get specific Role by Role ID
router.route('/:roleId')
  .get(validateParams(paramsSchemas.role.readRoleById), RoleController.readRoleById);

/*******************************************************************************************
*                                     PUT ROUTES
********************************************************************************************/

// Edit a Role by Role ID
router.route('/:roleId')
  .put(validateBody(bodySchemas.role.updateRole), validateParams(paramsSchemas.role.updateRole),
  RoleController.updateRole);

/*******************************************************************************************
*                                    DELETE ROUTES
********************************************************************************************/

// Delete a Role by Role ID
router.route('/')
  .delete(validateBody(bodySchemas.role.deleteRole), RoleController.deleteRole);

  module.exports = router;