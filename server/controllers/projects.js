const Project = require('../models/project/project');
const Package = require('../models/package/package');

const { isValidObjectId } = require('../helpers/controller_helper');
const errorHelper = require('../helpers/error_helper');

module.exports = {
    createProject: async (req, res) => {
        const { pinNumber, projectName, packageId, active = true } = req.value.body;
        if(!isValidObjectId(packageId)) { errorHelper.project.invalidId(res) }
        const foundProject = await Project.findOne({ pinNumber });
        if(foundProject) { errorHelper.project.alreadyExists(res) }
        const newProject = new Project({ pinNumber, projectName, package: packageId, active });
        await newProject.save();
        res.status(201).json({ success: true, message: 'Project successfully created' });
    },
    readProjectById: async (req, res) => {
        const { projectId } = req.value.params;
        if(!isValidObjectId(projectId)) { errorHelper.project.invalidId(res) }
        const foundProject = await Project.findById(projectId).populate('package');
        if(!foundProject) { errorHelper.project.doesNotExist(res) }
        return res.status(200).json({ success: true, data: foundProject });
    },
    readProjectsByPackageCode: async (req, res) => {
        let { packageCode } = req.value.params;
        packageCode = packageCode.toUpperCase();
        const foundProjects = await Project.find({}).populate({
            path: 'package', match: { packageCode: { $eq: packageCode } } });
        if(foundProjects == 0) { errorHelper.project.noneToDisplay }

        let returnObject = [];

        await foundProjects.filter((data) => {
            if(data.package.length > 0) {
                returnObject.push(data);
            }
        })

        if(returnObject.length == 0) {
            errorHelper.project.noneToDisplay(res);
        }

        return res.status(200).json({ success: true, data: returnObject });
    },
    readProjects: async (req, res) => {
        const foundProjects = await Project.find({}).populate('package');
        if(foundProjects.length == 0) { errorHelper.project.noneInDatabase(res) }
        return res.status(200).json({ success: true, data: foundProjects });
    },
    readProjectsByCodeAndActiveStatus: async (req, res) => {

        let { packageCode, active } = req.value.params;
        packageCode = packageCode.toUpperCase();

        let activeProjects = null;
        switch (active) {
            case "active":
                activeProjects = true;
                break;
            case "inactive":
                activeProjects = false;
                break;
            default:
                return res.status(200).json({
                    success: false,
                    message: 'Please submit either active or inactive for the project status'
                });
        }   

        const foundProjects = await Project.find({ active: activeProjects }).populate({
            path: 'package', match: { packageCode: { $eq: packageCode } } 
        });
        if(foundProjects == 0) { errorHelper.project.noneToDisplay }

        let returnObject = [];

        await foundProjects.filter((data) => {
            if(data.package.length > 0) {
                returnObject.push(data);
            }
        })

        if(returnObject.length == 0) {
            errorHelper.project.noneToDisplay(res);
        }
        
        return res.status(200).json({ success: true, data: returnObject });
    },
    readProjectsByActiveStatus: async (req, res) => {
        const foundProjects = await Project.find({ active: true });
        if (!foundProjects || foundProjects.length == 0) {
            return res.status(200).json({ success: true, message: 'There are no active projects to display'});
        }
        return res.status(200).json({ success: true, data: foundProjects });
    },
    readProjectsByInactiveStatus: async (req, res) => {
        const foundProjects = await Project.find({ active: false });
        if (!foundProjects || foundProjects.length == 0) {
            return res.status(200).json({ success: true, message: 'There are no inactive projects to display'});
        }
        return res.status(200).json({ success: true, data: foundProjects });
    },
    updateProject: async (req, res) => {
        let { projectId } = req.value.params;
        if(!isValidObjectId(projectId)) { errorHelper.project.invalidId(res) }
        const foundProject = await Project.find({ _id: projectId });
        if (!foundProject) { errorHelper.project.doesNotExist(res) }
        const updateObject = req.value.body;
        const updateProject = await Project.findByIdAndUpdate(projectId, updateObject, { new: true });
        if (!updateProject) { errorHelper.project.couldNotUpdate(res) }
        return res.status(200).json({ success: true, data: updateProject });
    },
    deleteProject: async (req, res) => {
        const { projectId } = req.value.body;
        if(!isValidObjectId(projectId)) { errorHelper.project.invalidId(res) }
        const foundProject = await Project.findByIdAndDelete(projectId);
        if(!foundProject) { errorHelper.project.doesNotExist(res) }
        return res.status(200).json({ success: true, message: 'Project successfully deleted' });
    }
}