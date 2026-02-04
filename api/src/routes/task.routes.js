import express from "express";
import { createTask, getAllTasks, getTaskById, retryTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", createTask);
router.get("/", getAllTasks);
router.post("/:id/retry", retryTask);
router.get("/:id", getTaskById);

export default router;