import redis from "../config/redis.js";
import {Queue} from "bullmq"

export const taskQueue = new Queue("task-queue",{
    connection : redis,
})