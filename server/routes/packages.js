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

const PackageController = require('../controllers/packages');

const passportJWT = passport.authenticate('jwt', { session: false });


/*******************************************************************************************
*                                      POST ROUTES
********************************************************************************************/

// Create a new Package
router.route('/')
    .post(validateBody(bodySchemas.package.createPackage), PackageController.createPackage);

/*******************************************************************************************
*                                      GET ROUTES
********************************************************************************************/

// Get all Packages
router.route('/')
    .get(PackageController.readAllPackages);
    
// Get package by Package ID
router.route('/id/:packageId')
    .get(validateParams(paramsSchemas.package.readPackage), PackageController.readPackageById);

// Get package by Package Code (QL17, QK17, NE17, NR17 etc.)
router.route('/:packageCode')
    .get(validateParams(paramsSchemas.package.readPackageByCode), 
        PackageController.readPackagesByPackageCode);  

/*******************************************************************************************
*                                     PUT ROUTES
********************************************************************************************/

// Edit a Package for a specific Package ID
router.route('/:packageId')
    .put(validateParams(paramsSchemas.package.updatePackage),
        validateBody(bodySchemas.package.updatePackage),
        PackageController.updatePackage);

/*******************************************************************************************
*                                   DELETE ROUTES
********************************************************************************************/

// Delete a Package by Package ID
router.route('/')
    .delete(validateBody(bodySchemas.package.deletePackage), PackageController.deletePackage);    
        
module.exports = router;