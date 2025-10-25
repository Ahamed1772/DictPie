import express from 'express'
const authRouter = express.Router();

//controller
import { signUP, login, verification, logOut, getUserDetails, googleAuth } from '../controller/auth.controller.js'
import protect from '../config/protectRoute.js'

authRouter.post('/signup', signUP);
authRouter.post('/login', login);
authRouter.post('/verify/user', protect, verification);
authRouter.post('/logout', protect, logOut);
authRouter.get('/user' , getUserDetails);
authRouter.post('/googleauth/signUp', googleAuth);

export default authRouter;