import { ApiError } from "./ApiError"

const asyncHandler = (fn) => {
    if (typeof fn !== 'function') {
        throw new ApiError(404, `asyncHandler expects a function, got ${typeof fn}`) 
    }
    return (req, res, next) => 

    {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

export { asyncHandler }
