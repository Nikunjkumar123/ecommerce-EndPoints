const User = require('../models/User.models.js')
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors')
const {createTokenUser, attachCookiesToResponse, checkPermissions}= require('../utils');
const getAllUsers = async (req, res) => { // get all user with role of user
  const users = await User.find({role:'user'}).select('-password');
  res.status(StatusCodes.OK).json({users});
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({_id:req.params.id}).select('-password');
  if(!user){
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`)
  }
  checkPermissions(req.user,user._id);
  res.status(StatusCodes.OK).json({user})
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({user:req.user})
};
// update user with user.save()
const updateUser = async (req, res) => {
  const {email,name} = req.body
  if(!email ||!name){
    throw new CustomError.BadRequestError('pls provide all value');
  }
  const user = await User.findOne({_id:req.user.userId});
  user.email = email;
  user.name = name;
  await user.save();
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({res,user:tokenUser})
  res.status(StatusCodes.OK).json({user:tokenUser})
};
const updateUserPassword = async (req, res) => {
  const {oldpassword,newPassword} = req.body;
  if(!oldpassword || !newPassword){
    throw new CustomError.BadRequestError('pls fill both entries')
  }
  const user = await User.findOne({_id:req.user.userId});
  const isPAsswordCorrect = await user.comparePassword(oldpassword);
  if(!isPAsswordCorrect){
    throw new CustomError.UnauthenticatedError('invalid credentials');
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({msg:'Success! password changed'});
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};