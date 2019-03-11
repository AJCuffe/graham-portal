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

const ProjectController = require('../controllers/projects');

const passportJWT = passport.authenticate('jwt', { session: false });


/*******************************************************************************************
*                                      POST ROUTES
********************************************************************************************/

// Create new Project
router.route('/')
    .post(validateBody(bodySchemas.project.createProject), ProjectController.createProject);


/*******************************************************************************************
*                                      GET ROUTES
********************************************************************************************/

// Get all Projects
router.route('/')
    .get(ProjectController.readProjects);

// Get Project by Project ID
router.route('/:projectId')
    .get(validateParams(paramsSchemas.project.readProjectById), ProjectController.readProjectById);
    
// Get all Projects for specific Package Code
router.route('/code/:packageCode')
    .get(validateParams(paramsSchemas.project.readProjectsByPackageCode),
    ProjectController.readProjectsByPackageCode);
    
// Get all active Projects for specific Package Code
router.route('/code/:packageCode/:active')
    .get(validateParams(paramsSchemas.project.readProjectsByCodeAndActiveStatus), 
    ProjectController.readProjectsByCodeAndActiveStatus);
    
// Get all active Projects for all Package Codes
router.route('/active')
    .get(ProjectController.readProjectsByActiveStatus);
        
// Get all inactive Projects for all Package Codes
router.route('/inactive')
    .get(ProjectController.readProjectsByInactiveStatus);

/*******************************************************************************************
*                                     PUT ROUTES
********************************************************************************************/
    
// Edit a Project by Project ID
router.route('/:projectId')
    .put(validateParams(paramsSchemas.project.updateProject), 
    validateBody(bodySchemas.project.updateProject), ProjectController.updateProject);

/*******************************************************************************************
*                                    DELETE ROUTES
********************************************************************************************/

// Delete a Project by Project ID
router.route('/')
    .delete(validateBody(bodySchemas.project.deleteProject), ProjectController.deleteProject);
    
module.exports = router;