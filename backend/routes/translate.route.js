import express from 'express'
const translateRouter = express.Router();
import protect from '../config/protectRoute.js';

//import controller
import { translateMeaning } from '../controller/translate.controller.js'

translateRouter.post('/translate', translateMeaning);


export default translateRouter;