import mongoose from "mongoose";

const LoginInfo = mongoose.model('LoginInfo', new mongoose.Schema({
    email: String,
    password: String
}));

export default LoginInfo