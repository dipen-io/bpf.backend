import express from "express";
import { loginUser, registerUser } from "./auth.controller.js";
const router = express.Router();


/**
 * @openapi
 * /api/v1/auth/login:
 *   get:
 *     summary: Login in user
 *     tags: [login]
 *     responses:
 *       200:
 *         description: Login user
 */

router.post('/login', loginUser);

/**
 * @openapi
 * /api/v1/auth/register:
 *   get:
 *     summary: Register user
 *     tags: [register]
 *     responses:
 *       201:
 *         description: New user accout creation
 */

router.post('/register', registerUser);

export default router;
