import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import "dotenv/config";

describe("Task API", () => {
    let taskId;

    beforeAll(async () => {
        // Connect to MongoDB before tests
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should create a task", async () => {
        const res = await request(app)
            .post("/tasks")
            .send({
                type: "email",
                payload: { to: "test@test.com" }
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.taskId).toBeDefined();

        taskId = res.body.taskId;
    });

    it("should get task status", async () => {
        const res = await request(app).get(`/tasks/${taskId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeDefined();
    });

    it("should list tasks", async () => {
        const res = await request(app).get("/tasks");

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
