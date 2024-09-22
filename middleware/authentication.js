const CustomErr = require('../errors')
const {validToken} = require('../utils');

const authenticateUser = async (req,res,next)=>{
    const token = req.signedCookies.token
    if(!token){
        throw new CustomErr.UnauthenticatedError('Authentication Failed')
    }
    try {
        const {name,userId,role} = validToken({token});
        req.user = {name,userId,role};
        next();
    } catch (error) {
        throw new CustomErr.UnauthenticatedError('Authentication Failed')
    }
}
const authorizePermissions = (...roles)=>{
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            throw new CustomErr.unauthorizedError('unauthorized to access this route')
        }
        next();
    };
}

module.exports = {authenticateUser,authorizePermissions,}