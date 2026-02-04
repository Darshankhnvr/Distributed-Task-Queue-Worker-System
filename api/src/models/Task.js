import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum :["email", "report", "resize-image"]
        },
        payload: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending"
        },
        retries:{
            type: Number,
            default: 0,
        }
    }, {timestamps: true}
)
const Task = mongoose.model("Task", taskSchema);

export default Task;