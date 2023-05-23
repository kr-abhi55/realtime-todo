import mongoose from "mongoose";

const Todo = mongoose.model("Todo", new mongoose.Schema({
    text: { required: true, type: String },
    isCompleted: { required: true, type: Boolean },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}))
export default Todo