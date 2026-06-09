import cors from "cors";
import { config } from "../config/env.js";

const corsMiddleware =  cors({
    origin: config. ALLOWED_ORIGINS.split(','),
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-with", "Accpet", "Authorization"],
});

export { corsMiddleware }; 
