import Task from "../models/Task.js"
import { taskQueue } from "../queue/task.queue.js";

import { MAX_RETRIES } from "../config/constants.js";

export const retryTask = async (req, res) => {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    if (task.status !== "failed") {
        return res.status(400).json({ error: "Only failed tasks can be retried" });
    }

    if (task.retries >= MAX_RETRIES) {
        return res.status(400).json({ error: "Max retries reached" });
    }

    task.status = "pending";
    task.retries += 1;
    await task.save();

    await taskQueue.add("process-task", {
        taskId: task._id.toString()
    });

    res.json({
        message: "Task retried",
        retries: task.retries
    });
};

export const createTask = async (req, res) => {

    try {
        const { type, payload } = req.body;

        const task = await Task.create({
            type,
            payload
        })

        await taskQueue.add("process-task", {
            taskId: task._id.toString(),
        })

        res.status(201).json({
            taskId: task._id,
            status: task.status
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        res.json({
            id: task._id,
            status: task.status
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}