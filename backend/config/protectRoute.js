import httpCodes from 'http-status-codes'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
env.config()

//database import
import User from '../models/auth.js';

const protect = async(req, res, next) => {
    try {
        //token authorization
    const token = req.cookies.jwt;
    if(!token){
        return res.status(httpCodes.UNAUTHORIZED).json({
            success: false,
            message: "You are unauthorized to this page.so please login"
        })
    }
    //if token exist, verify token
    const tokenVerify = jwt.verify(token, process.env.JWT_SECRET)
    if (!tokenVerify){
         return res.status(httpCodes.UNAUTHORIZED).json({
            success: false,
            message: "Invalid Token"
        })
    }
    //if user exist on that token in db
    console.log(tokenVerify);
    const userExist = await User.findById(tokenVerify.userId);
    if(!userExist){
        return res.status(httpCodes.UNAUTHORIZED).json({
            success: false,
            message: "User Not Found"
        })
    }
    req.user = userExist;
    req.userId = tokenVerify.userId;
    console.log("Incoming cookies:", req.cookies);
    next();
    } catch (error) {
        return res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "There is Error in protectRoute route in protect",
            error: error.message
        })
    }
}


export default protect;