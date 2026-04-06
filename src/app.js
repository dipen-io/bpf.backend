import express from "express";
const app = express()
app.use('/health', (_, res) => {
    res.send("server is running");
})

export { app };