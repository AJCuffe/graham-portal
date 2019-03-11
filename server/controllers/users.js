const JWT = require('jsonwebtoken');
const User = require('../models/user/user');
const Password = require('../models/user/password');
const { JWT_SECRET } = require('../configuration');

const Role = require('../models/permission/role');

const { isValidObjectId } = require('../helpers/controller_helper');
const errorHelper = require('../helpers/error_helper');

const signToken = user => {
  return JWT.sign({
    iss: 'APIAuthentication',
    sub: user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1) // expire in 24 hours
  }, JWT_SECRET);
}

module.exports = {
  createUser: async (req, res) => {
    console.log(req.value.body);
    const { 
      email, 
      password, 
      firstName, 
      lastName,
      passwordQuestion,
      passwordAnswer
    } = req.body;

    const foundUser = await User.findOne({ email });
    if (foundUser) { errorHelper.user.emailInUse(res) }

    const foundUserRole = await Role.findOne({ roleName: "user" });
    if(!foundUserRole) { errorHandler.user.noUserRoleSet(res) }

    const newUser = new User({ email, firstName, lastName, role: foundUserRole._id });

    await newUser.save().then(async (newUser) => {
      const newPassword = new Password({
        userId: newUser._id,  
        password,
        passwordQuestion, 
        passwordAnswer
      });
      await newPassword.save();
      const token = signToken(newUser);

      res.status(201).json({ token });
    });
  },
  signInUser: async (req, res) => {
    const token = signToken(req.user);
    res.status(200).json({ token });
  },
  readUsers: async (req, res) => {
    const foundUsers = await User.find({}).populate('role', 'roleName');
    if(foundUsers.length == 0) { errorHelper.user.noneInDatabase(res) }
    return res.status(200).json({ success: true, foundUsers});
  },
  readUserById: async (req, res) => {
    const { userId } = req.value.params;
    if (!isValidObjectId(userId)) { errorHelper.user.invalidId(res) }
    const foundUser = await User.findById(userId).populate('role');
    if(!foundUser) { errorHelper.user.noneWithThatId(res) }
    return res.status(200).json({ success: true, foundUser });
  },
  readUsersPendingAccountApproval: async (req, res) => {

  },
  readUsersCurrentlyActive: async (req, res) => {

  },
  deleteUser: async (req, res) => {

  },
  editUserInfo: async (req, res) => {

  },
  lockUserAccount: async (req, res) => {

  },
  unlockUserAccount: async (req, res) => {

  }
}