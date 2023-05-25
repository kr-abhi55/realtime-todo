import dotenv from 'dotenv';
import MongoDbHelper from './MongoDbHelper.js';
import JwtAuthHelper from './JWTAuthHelper.js';
import mongoose from 'mongoose';
import Utils from './Utils.js';
import express from 'express';
import todoRouter from './routes/TodoRouter.js';
import cors from 'cors'
import SocketHandler from './SocketHandler.js';
dotenv.config();
const app = express();
app.use(cors({ origin: "*" }))
app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(todoRouter)
await MongoDbHelper("realtime-todo")
JwtAuthHelper(app)

const server=app.listen(Utils.env.EXPRESS_PORT, () => {
    console.log('Server started on port http://localhost:'+Utils.env.EXPRESS_PORT);
});

new SocketHandler(server)