import express from "express";
import morgan from "morgan";
import swaggerUiExpress from "swagger-ui-express";
import { logger } from "./utils/logger.js";
import { config } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import {reqMiddleware } from "./middlewares/req.middleware.js"
import { corsMiddleware } from "./middlewares/cors.middleware.js";

import { router as apiRouter } from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// 1. Global Parse Middlewares
app.use(express.json());
app.use(corsMiddleware);
app.use(reqMiddleware);

// 2. HTTP Request Logging (Placed early to catch ALL traffic)
const morganStream = {
  write: (message) => logger.info(message.trim())
}; 

const morganFormat = config.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: morganStream }));


// 3. API Documentation Route
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

app.use("/api/v1", apiRouter)


// 4. Monitoring / Health Checks
app.use('/health', (_, res) => {
  res.status(200).send("server is running");
});

// 5. Global Error Handling Middleware (Crucial for Production)
app.use(errorHandler) 

export { app };
