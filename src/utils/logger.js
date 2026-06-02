import winston from "winston";
import { config } from "../config/env.js";

const { combine, timestamp, json, colorize, printf } = winston.format;

// Custom format for clean terminal outputs during local development
const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let extra = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
    return `${timestamp} [${level}]: ${message} ${extra}`;
});

// Dynamically construct the formats array based on the environment
const formats = [
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
];

if (config.NODE_ENV === 'production') {
    formats.push(json());
} else {
    // Push separate format instances directly into the flat array setup
    formats.push(colorize(), devFormat);
}

export const logger = winston.createLogger({
    level: config.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(...formats), // Combines a flat array perfectly
    transports: [
        new winston.transports.Console()
    ],
});
