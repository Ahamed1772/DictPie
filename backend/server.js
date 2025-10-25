import express from 'express'
import cookieParser from 'cookie-parser'
import env from 'dotenv'
import cors from 'cors'
env.config();

const app = express();
const port = process.env.PORT;

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));




//routes
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import saveRouter from './routes/save.route.js';
import translateRouter from './routes/translate.route.js';
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/data', saveRouter);
app.use('/api/message', translateRouter);



//database
import connectDb from './config/db.js';
connectDb();
app.listen(port, () => {
    console.log(`Application is successfully running on port: ${port}`)
});
