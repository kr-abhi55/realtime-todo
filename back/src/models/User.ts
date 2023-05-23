import mongoose from "mongoose";

const User = mongoose.model("User", new mongoose.Schema({
    name: { required: true, type: String },
    gender: { required: true, type: String },
    age: { required: true, type: Number },
    loginInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoginInfo',
        required: true
    }
}))
export default User