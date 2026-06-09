import { config } from "../config/env.js"
import { logger } from "../utils/logger.js"

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.code    = err.message    || "INTERNAL_SERVER_ERROR"

    // log error for dev mode
    logger.error(`[${req.method}] ${req.path} - ${err.message}`, {
        stack: err.stack,
        errors: err.errors
    })


    if (config.NODE_ENV === "development") {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            errors: err.errors,
            stact: err.stack,
            ...(config.NODE_ENV === "development" && { stack: err.stack })
        });
    }

    // operational errors if we threw errors
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            code: err.code,
            message: err.message,
            errors: err.errors.length ? err.errors : undefined
        });

    }

    // unknow bugs or database drop in production (Hide dirty details)
    return res.status(500).json({
        success: false,
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong on our end. Please try again later."
    });

}

export { errorHandler }
