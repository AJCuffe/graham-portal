const Package = require('../models/package/package');

const { isValidObjectId } = require('../helpers/controller_helper');
const errorHelper = require('../helpers/error_helper');

module.exports = {
    createPackage: async (req, res) => {
        const { packageName, packageCode } = req.value.body;
        const foundPackage = await Package.findOne({ packageCode });
        if(foundPackage) { errorHelper.package.alreadyExists(res) }
        const newPackage = new Package({ packageName, packageCode });
        await newPackage.save();
        res.status(201).json({ success: true, message: 'Package successfully created', data: newPackage });
    },
    readPackageById: async (req, res) => {
        const { packageId } = req.value.params;
        if(!isValidObjectId(packageId)) { errorHelper.package.invalidId(res) }
        const foundPackage = await Package.findById(packageId);
        if(!foundPackage) { errorHelper.package.doesNotExist(res) }
        return res.status(200).json({ success: true, data: foundPackage });
    },
    readPackagesByPackageCode: async (req, res) => {
        let { packageCode } = req.value.params;
        packageCode = packageCode.toUpperCase();
        const foundPackages = await Package.find({ packageCode });
        if (!foundPackages || foundPackages.length == 0) { errorHelper.package.noneWithThatCode(res); }
        return res.status(200).json({ success: true, data: foundPackages });
    },
    readAllPackages: async (req, res) => {
        const foundPackages = await Package.find({});
        if(!foundPackages) { errorHelper.package.noneInDatabase(res) }
        return res.status(200).json({ success: true, data: foundPackages });
    },
    updatePackage: async (req, res) => { 
        let { packageId } = req.value.params;
        if(!isValidObjectId(packageId)) { errorHelper.package.invalidId(res) }
        const foundPackage = await Package.find({ _id: packageId });
        if (!foundPackage) { errorHelper.package.doesNotExist(res) }
        const updateObject = req.value.body;
        const updatePackage = await Package.findByIdAndUpdate(packageId, updateObject, { new: true });
        if (!updatePackage) { errorHelper.package.couldNotUpdate(res) }
        return res.status(200).json({ success: true, data: updatePackage });
    },
    deletePackage: async (req, res) => {
        const { packageId } = req.value.body;
        if(!isValidObjectId(packageId)) { errorHelper.package.invalidId(res) }
        const foundPackage = await Package.findByIdAndDelete(packageId);
        if(!foundPackage) { errorHelper.package.doesNotExist(res) }
        return res.status(200).json({ success: true, message: 'Package successfully deleted' });
    }
}