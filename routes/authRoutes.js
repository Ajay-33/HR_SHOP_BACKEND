import express from "express";
import userAuth from "../middlewares/authmiddleware.js";
import { loginController, registerController } from "../controllers/authController.js";
const router = express.Router();

// REGISTER
router.post("/register", registerController);

// LOGIN
router.post("/login", loginController);

export default router;
