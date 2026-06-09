import userRoute from "../modules/user/user.route.js";
import authRoute from "../modules/auth/auth.router.js";
import express from "express";

const router = express.Router();

router.use('/user', userRoute);
router.use('/auth', authRoute);

export { router };

