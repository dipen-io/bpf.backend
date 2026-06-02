import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./env.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BPF Backend API',
            version: '1.0.0',
            description: 'Production API documentation'
        },
        servers: [
            {
                url: config.NODE_ENV === 'production'
                    ? 'https://api.mydomain.com'
                    : 'http://localhost:8000',
                description: config.NODE_ENV === 'production' ? 'Production' : 'Dev',
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
            },
        },
    },
    apis: [
        `${__dirname}/../app.js`,
        `${__dirname}/../modules/**/*.route.js`,   // ← was "module", now "modules"
        `${__dirname}/../routes/*.js`,

    ],
};

export const swaggerSpec = swaggerJsdoc(options);
