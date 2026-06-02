import express from "express";
const router = express.Router();


/**
 * @openapi
 * /api/v1/user/:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */

router.get('/', (_, res) => {
    res.send("hello world user");
})

export default router;
