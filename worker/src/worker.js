import 'dotenv/config'
import Redis from "ioredis";
import { Worker } from "bullmq";
import { processTask } from './processors/taskProcessor.js';
import mongoose from 'mongoose'

const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});


await mongoose.connect(process.env.MONGO_URI)
console.log("Connected to MongoDB")

const taskSchema = new mongoose.Schema({
    type: String,
    payload: Object,
    status: String,
    retries: Number,
}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema);

const worker = new Worker(
    "task-queue",
    async (job) => {
        const { taskId } = job.data;
        const task = await Task.findById(taskId);

        if (!task) return;

        try {
            // Step 1: Mark as processing
            await Task.findByIdAndUpdate(taskId, {
                status: "processing",
            });

            // Step 2: Execute the actual task (can throw error)
            await processTask(task);

            // Step 3: Mark as completed (only reaches here if no error)
            await Task.findByIdAndUpdate(taskId, {
                status: "completed"
            });
        } catch (error) {
            console.error(`Task ${taskId} failed:`, error.message);
            await Task.findByIdAndUpdate(taskId, {
                status: "failed",
                retries: task.retries + 1
            });
        }
    },
    { connection }
)

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
})
worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed`, err.message);
});

