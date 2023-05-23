import dotenv from 'dotenv';
import MongoDbHelper from './MongoDbHelper.js';
import WebSocketServerHandler from './WebSocketServerHandler.js';
import JwtAuthHelper from './JWTAuthHelper.js';
import mongoose from 'mongoose';
import Utils from './Utils.js';
import express from 'express';
import todoRouter from './routes/TodoRouter.js';
import cors from 'cors'
dotenv.config();
const app = express();
app.use(cors({origin:"*"}))
app.use(express.json());

app.use(express.urlencoded());
app.use(todoRouter)
await MongoDbHelper("realtime-todo")
JwtAuthHelper(app)

app.listen(3000, () => {
    console.log('Server started on port http://localhost:3000');
});

new WebSocketServerHandler(8080)