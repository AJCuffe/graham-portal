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

const UsersController = require('../controllers/users');

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

/*******************************************************************************************
*                                      POST ROUTES
********************************************************************************************/

// Sign a user up
router.route('/signup')
  .post(validateBody(bodySchemas.user.signup), UsersController.createUser);

// Sign a user in
router.route('/signin')
  .post(validateBody(bodySchemas.user.auth), passportSignIn, UsersController.signInUser);
  
/*******************************************************************************************
*                                      GET ROUTES
********************************************************************************************/

// Get all users
router.route('/')
  .get(UsersController.readUsers);

// Get specific user by User ID
router.route('/:userId')
  .get(validateParams(paramsSchemas.user.readUserById), UsersController.readUserById);

module.exports = router;