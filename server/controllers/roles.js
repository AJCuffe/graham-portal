const Role = require('../models/permission/role');

const { isValidObjectId } = require('../helpers/controller_helper');
const errorHelper = require('../helpers/error_helper');

module.exports = {
  createRole: async (req, res) => {
    const { roleName, roleNote } = req.value.body;
    const roleFound = await Role.findOne({ roleName });
    if(roleFound) { errorHelper.role.alreadyExists(res) }
    const newRole = await Role.create({ roleName, roleNote });
    if(!newRole) { errorHelper.role.couldNotCreate(res) }
    return res.status(200).json({ success: true, data: newRole});
  },
  readRoles: async (req, res) => {
    const rolesFound = await Role.find({});
    if(!rolesFound || rolesFound == 0) { errorHelper.role.noneInDatabase(res) }
    return res.status(200).json({ success: true, data: rolesFound });
  },
  readRoleById: async (req, res) => {
    const { roleId } = req.value.params;
    if(!isValidObjectId(roleId)) { errorHelper.role.invalidId(res) }
    const roleFound = await Role.findById(roleId);
    if(!roleFound) { errorHelper.role.doesNotExist(res) }
    return res.status(200).json({ success: true, data: roleFound });
  },
  updateRole: async (req, res) => {
    let { roleId } = req.value.params;
    if(!isValidObjectId(roleId)) { errorHelper.role.invalidId(res) }
    const foundRole = await Role.findById(roleId);
    if (!foundRole) { errorHelper.role.doesNotExist(res) }
    const updateObject = req.value.body;
    const updateRole = await Role.findByIdAndUpdate(roleId, updateObject, { new: true });
    if (!updateRole) { errorHelper.role.couldNotUpdate(res) }
    return res.status(200).json({ success: true, data: updateRole });
  },
  deleteRole: async(req, res) => {
    const { roleId } = req.value.body;
    if(!isValidObjectId(roleId)) { errorHelper.role.invalidId(res) }
    const deleteRole = await Role.findByIdAndDelete(roleId);
    if(!deleteRole) { errorHelper.role.doesNotExist(roleId) }
    return res.status(200).json({ success: true, message: 'Role sucessfully deleted'});
  }
}