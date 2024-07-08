import express from "express";
import { AuthController } from "../controllers/authController";
import { UserService } from "../services/userService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
//DI means jo dependecice chiye rahatiy class keliy usko constructor ke under se receive karte woh
const userService = new UserService(userRepository);
//intaance
const authController = new AuthController(userService, logger)

router.post("/register", (req, res, next) => authController.register(req, res, next));

export default router;