import winston from "winston";
import { config } from "../config/env.js";

const { combine, timestamp, json, colorize, printf } = winston.format;

const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let extra = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
    return `${timestamp} [${level}]: ${message} ${extra}`;
});

export const logger = winston.createLogger({
    level: config.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        config.NODE_ENV === 'production' ? json() : combine(colorize(), devFormat)
    ),

    transports: [
        new winston.transports.Console()
    ],
})
