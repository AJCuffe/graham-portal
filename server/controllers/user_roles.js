const User = require('../models/user/user');

const { isValidObjectId } = require('../helpers/controller_helper');
const errorHelper = require('../helpers/error_helper');

module.exports = {
  assignRole: async (req, res) => {
    const { userId } = req.value.params;
    const { roleId } = req.value.body;

    if(!isValidObjectId(userId)) { errorHelper.user.invalidId(res) }
    if(!isValidObjectId(roleId)) { errorHelper.role.invalidId(res) }

    const userExists = await User.findById(userId);
    if(!userExists) { errorHelper.user.doesNotExist(res) }
    const updateUser = await User.findByIdAndUpdate(userId, { $push: { role: roleId } });
    if(!updateUser) { errorHelper.user.errorUpdating(res) }
    return res.status(200).json({ success: true, message: `Successfully assigned a new role to User ID ${userId}` });
  },
  revokeRole: async (req, res) => {
    const { userId } = req.value.params;
    const { roleId } = req.value.body;

    if(!isValidObjectId(userId)) { errorHelper.user.invalidId(res) }
    if(!isValidObjectId(roleId)) { errorHelper.role.invalidId(res) }

    const userExists = await User.findById(userId);
    if(!userExists) { errorHelper.user.doesNotExist(res) }
    const updateUser = await User.findByIdAndUpdate(userId, { $pull: { role: roleId } });
    if(!updateUser) { errorHelper.user.errorUpdating(res) }
    return res.status(200).json({ success: true, message: `Successfully revoked a role from User ID ${userId}` });
  }
}