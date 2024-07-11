import express from "express";
import { AuthController } from "../controllers/authController";
import { UserService } from "../services/userService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";

//express.Router middleware as it allows us to group the route handlers for a particular part
//express.Router is used to create modular, mountable route handlers. It allows you to organize routes into separate files and modules.
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
//DI means jo dependecice chiye rahatiy class keliy usko constructor ke under se receive karte woh
const userService = new UserService(userRepository);
//Instances 
const authController = new AuthController(userService, logger)

// POST /users/register - Register a new user
router.post("/register", (req, res, next) => authController.register(req, res, next));
// GET /users - Fetch all users
router.get('/customers', (req, res, next) => authController.getAllCustomers(req, res, next));

export default router;