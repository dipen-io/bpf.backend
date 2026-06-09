// structure api error class

class AppError extends Error {
    constructor({ statusCode, message, code = "INTERNAL_ERROR", errors = [], stack = ""}) {
        super(message)
        this.statusCode = statusCode
        this.errors = errors
        this.code = code
        this.success = false
        this.isOperational = true;

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

class BadRequestError extends AppError {
    constructor(message = "Bad Request", code="BAD_REQEST", errors = []){
        super({statusCode: 400, message, code, errors});
    }
}

class UnauthorizedError extends AppError{
    constructor(message = "Unauthorized", code="UNAUTHORIZED") {
        super({ statusCode: 401, message, code });
    }
}

class ForbiddenError extends AppError {
    constructor(message="Forbidden", code = "FORBIDDEN" ) {
        super({ statusCode: 403, message, code });
    }
}

class NotFoundError extends AppError{
    constructor({ message = "Resource not found", code = "NOT_FOUND" }) {
        super({ statusCode: 404, message, code })
    }
}

class ConflictError extends AppError {
    constructor(message="Conflict occured", code = "CONFLICT_ERROR") {
        super({ statusCode: 409, message, code });
    }
}

class TooManyRequests extends AppError {
    constructor(message = "Too many requests, pleae try again later", code = "TOO_MANY_REQEST" ) {
        super({ statusCode: 429, message, code });
    }
}


export { AppError, TooManyRequests, BadRequestError, ConflictError, UnauthorizedError, ForbiddenError, NotFoundError }

