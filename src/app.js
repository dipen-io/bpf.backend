import express from "express";
import morgan from "morgan";
import { logger } from "./utils/logger.js";
import { config } from "./config/env.js";

const app = express()
app.use(express.json())

const morgonStream = {
    write: (message) => logger.info(message.trim())
} 

const morgotFormat = config.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morgotFormat, {stream: morgonStream}));




app.use('/health', (_, res) => {
    res.send("server is running");
})

export { app };
