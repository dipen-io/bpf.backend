import "dotenv/config";
import { app } from "./src/app.js";
import { config } from "./src/config/env.js";
import http from "node:http2";

async function startServer() {
    try {
        // start the db connecttion
        const server = http.createServer(app);
        server.listen(config.PORT, () => {
            console.log(`✅ Server running on port ${config.PORT}`);
            if (process.env.NODE_ENV === "development") {
                console.log("Running in dev mode");
            }
        })
    } catch (error) {
        console.error("error starting server", error.message);
        process.exit(1);
    }
}

startServer();
