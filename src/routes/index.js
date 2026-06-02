import userRoute from "../modules/user/user.route.js"
import express from "express";

const router = express.Router();

router.use('/user', userRoute)

export { router };

