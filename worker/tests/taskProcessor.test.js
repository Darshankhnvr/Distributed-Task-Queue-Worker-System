import { processTask } from "../src/processors/taskProcessor.js";

describe("Task Processor", () => {
    it("should process email task", async () => {
        const task = {
            type: "email",
            payload: { to: "a@b.com" }
        };

        await expect(processTask(task)).resolves.not.toThrow();
    });

    it("should fail intentionally", async () => {
        const task = {
            type: "email",
            payload: { shouldFail: true }
        };

        await expect(processTask(task)).rejects.toThrow("Task configured to fail for testing");
    });
});
