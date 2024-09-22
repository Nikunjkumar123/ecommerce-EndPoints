const jwt = require('jsonwebtoken');

const createJWT = ({payload})=>{
    const token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:process.env.DAYS});
    return token;
}

const attachCookiesToResponse = ({ res, user }) => {
    const token = createJWT({ payload: user });
  
    const oneDay = 1000 * 60 * 60 * 24;
  
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    });
  };

const validToken = ({token})=>{
    return jwt.verify(token,process.env.SECRET_KEY);
}

module.exports = {createJWT,validToken,attachCookiesToResponse};