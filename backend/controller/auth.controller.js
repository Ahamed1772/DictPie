import httpStatus from 'http-status-codes'
import bcrypt from 'bcrypt'
import User from '../models/auth.js';
import { generateCode } from '../config/generateCode.js'
import sendEmail from '../config/sendEmail.js'
import emailTemplate from '../config/emailTemplate.js';
import jsonWebtokenAndCookieParser from '../config/generateWebtoken.js';

export const signUP = async(req,res) => {
    try {
        const {name,password,confirmPassword,email,phoneNumber} = req.body;
    //any missing details
    if (!name || !password || !confirmPassword || !email || !phoneNumber){
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "every details are required"
        })
    }

    //user exist already
    const userExist = await User.findOne({ email });
    if (userExist){
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "User Already Exist"
        })
    }

    //confirmpassword and password are same?
    if (password !== confirmPassword){
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Both password should be same"
        })
    }

    //creating the confirmation code and expires details
    const code = generateCode();
    const expiresDetail = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    //create user
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        phone: phoneNumber,
        confirmationCode: code,
        codeExpires: expiresDetail
    })

    if(user){
        await sendEmail(
        user.email,
        "Your Confirmation Code",
        emailTemplate(name, code)
    );

    //generate token and cookie
    jsonWebtokenAndCookieParser(user._id, res);

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "successfully created the user",
        data: user
    })
    }
    
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "There is error in signup route",
            error: error.message
        })
    }
    
} 


export const verification = async(req, res) => {
    try {
        const { code } = req.body;
        const user = req.user;
        console.log(code);
        if (code !== user.confirmationCode ){
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: "code you entered is wrong",
        })
        }

        const verifiedUser = await User.findByIdAndUpdate(user._id, { $set: { isVerified: true }}, {new: true})

         return res.status(httpStatus.OK).json({
            success: true,
            message: "successfully got the user Details",
            data: verifiedUser,
        })
   
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error in verification route",
            error: error.message
        })
    }
}

export const login = async(req,res) => {
    try {
        const {email, password} = req.body;

    //every details are matter
    if (!email || !password){
         res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "every details are required"
        })
    }

    //if user exist
    const userExist = await User.findOne({email});
    if (!userExist){
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "This user don't exist.please sign in to continue"
        })
    }

    //if exists
    const hashedPassword = await bcrypt.compare(password, userExist.password);
    if (!hashedPassword){
        res.status(httpStatus.UNAUTHORIZED).json({
            success: false,
            message: "The password you entered is incorrect"
        })
    }

    //set cookie
    jsonWebtokenAndCookieParser(userExist?._id, res);

    return res.status(httpStatus.OK).json({
        success: true,
        message: "successfully logged In",
        data: userExist
    })
    } catch (error) {
         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error in login route",
            error: error.message
        })
    }
    
}

export const logOut = async(req, res) => {
    try {
        // res.cookie("jwt", "", {maxAge: '0'});
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        res.status(httpStatus.OK).json({
            success: true,
            message: "Successfully logged out the user"
        })
    } catch (error) {
         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error in logout route",
            error: error.message
        })
    }
}

export const getUserDetails = async(req, res) => {
    try{
        const userDetails = req.user;
        return res.status(httpStatus.OK).json({
            success: true,
            message: "successfully got the user Details",
            data: userDetails
        })
    }catch (error){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "There is error in getting the getUserDetails in auth controller route",
            error: error.message
        })
    }
}

export const googleAuth = async(req, res) => {
    try {
        const { id, email, name, } = req.body;
        let user = await User.findOne({ $or: [{ AuthId: id }, { email }] });
        if (!user) {
            user = await User.create({
            AuthId: id,
            name: name,
            email: email,
            password: "Google Auth User",
            phone: "Google Auth User",
            isVerified: true
        })
        }
       
         //generate token and cookie
    jsonWebtokenAndCookieParser(user._id, res);

    res.status(httpStatus.CREATED).json({
        success: true,
        message: user.isNew ? "User created successfully" : "Login successful",
        data: user
    })

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "There is error in clerkSignUp route",
            error: error.message
        })
    }
}