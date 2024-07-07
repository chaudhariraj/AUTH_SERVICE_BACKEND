import express from "express";
import { AuthController } from "../controllers/authController";

const router = express.Router();
//intaance
const authController = new AuthController()

router.post("/register", (req, res) => authController.register(req, res));

export default router;