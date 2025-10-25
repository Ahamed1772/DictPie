import express from 'express'
const saveRouter = express.Router();

//controller
import { createMessage, getMessage, patchMessage, deleteMessage } from '../controller/save.controller.js'
import protect from '../config/protectRoute.js';

saveRouter.post('/save', protect, createMessage );
saveRouter.get('/get', protect, getMessage);
saveRouter.put('/patch', protect, patchMessage);
saveRouter.delete('/del', protect, deleteMessage);

export default saveRouter;