import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) =>{
    res.send("Enrty Point")
})

app.get("/health", (req, res) =>{
    res.json({status: "OK"})
})

export default app;