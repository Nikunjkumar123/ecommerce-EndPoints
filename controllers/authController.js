const mongoose = require('mongoose');
const User = require('../models/User.models')
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const {attachCookiesToResponse,createTokenUser} = require('../utils');


const register =async (req,res)=>{
    const {email,name,password} = req.body;
    const checkuserPresent = await User.findOne({email});
    if(checkuserPresent){
        throw new CustomError.BadRequestError('Email Already Exist');
    }
    // first registered user is an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    const user = await User.create({name,email,password,role});
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser});
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
}
const login =async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new CustomError.BadRequestError('pls fill all entries')
    }
    const user =await User.findOne({email});
    if(!user){
        throw new CustomError.UnauthenticatedError('Invalid Email');
    }
    const passmatch = await user.comparePassword(password);
    if(!passmatch){
        throw new CustomError.UnauthenticatedError('Invalid password')
    }       
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res,user:tokenUser});
    res.status(StatusCodes.OK).json({ user: tokenUser });
}
const logout =async (req,res)=>{
    res.cookie('token','logout',{httpOnly:true,expires:new Date(Date.now()+1000)})
    res.status(StatusCodes.OK).json({msg:'user logout successfully'})
}

module.exports = {register,login,logout};