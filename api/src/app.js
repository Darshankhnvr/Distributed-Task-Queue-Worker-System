import express from "express";
import taskRoutes from "./routes/task.routes.js"

const app = express();

app.use(express.json());

app.get("/", (req, res) =>{
    res.send("Enrty Point")
})

app.use("/tasks", taskRoutes)
app.get("/health", (req, res) =>{
    res.json({status: "OK"})
})

export default app;