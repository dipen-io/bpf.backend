import crypto from "crypto"
import jwt from "jsonwebtoken";
import { config } from "../config/env";

const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex')
}

const generateAccessToken = (userId) => {
    const payload = {
        id: userId
    }
    return jwt.sign( payload, config.JWT_ACCESS_SECRET, {expiresIn: config.JWT_ACCESS_SECRET_EXPIRY })
}

const generateRefreshToken = (userId) => {
    const payload = {
        id: userId ,
        jti: crypto.randomUUID()
    }
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: config.JWT_REFRESH_SECRET_EXPIRY })
}

const  verifyAccessToken = (token) => {
    return jwt.verify( token, config.JWT_ACCESS_SECRET );
}

const  verifyRefreshToken = (token) => {
    return jwt.verify( token, config.JWT_REFRESH_SECRET );
}

export { hashToken, generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
