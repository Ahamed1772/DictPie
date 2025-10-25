import express from 'express'
const messageRouter = express.Router();


//controller
import { fetchItem, fetchMean} from '../controller/message.controller.js'
import protect from '../config/protectRoute.js';

messageRouter.get('/simple', fetchItem);
// messageRouter.get('/ai/meaning', fetchAiMeaning);
messageRouter.get('/ai/meaning',  fetchMean);
export default messageRouter;