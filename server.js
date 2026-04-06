import "dotenv/config";
import { app } from "./src/app.js";
import http from "node:http2";
const PORT = process.env.PORT || 8000;

async function startServer() {
    try {
        // start the db connecttion
        const server = http.createServer(app);
        server.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
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