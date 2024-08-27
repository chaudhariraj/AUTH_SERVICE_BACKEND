import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/authController";
import { UserService } from "../services/userService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registerValidator from "../validators/register.validator";
import loginValidator from "../validators/login.validator";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import { CredentialService } from "../services/CredentialService";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import parseRefreshToken from "../middlewares/parseRefreshToken";

//express.Router middleware as it allows us to group the route handlers for a particular part
//express.Router is used to create modular, mountable route handlers. It allows you to organize routes into separate files and modules.
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
//DI means jo dependecice chiye rahatiy class keliy usko constructor ke under se receive karte woh
const userService = new UserService(userRepository);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);
const credentialService = new CredentialService();
//Instances 
const authController = new AuthController(userService, logger, tokenService, credentialService)

// POST /users/register - Register a new user
router.post("/register", registerValidator, (req: Request, res: Response, next: NextFunction) => authController.register(req, res, next));
// POST /users/login - login a new user
router.post("/login", loginValidator, (req: Request, res: Response, next: NextFunction) => authController.login(req, res, next));
router.get("/self", authenticate, (req: Request, res: Response) => authController.self(req as AuthRequest, res));
router.post("/refresh", validateRefreshToken, (req: Request, res: Response, next: NextFunction) => authController.refresh(req as AuthRequest, res, next));
router.post("/logout", authenticate, parseRefreshToken,  (req: Request, res: Response, next: NextFunction) => authController.logout(req as AuthRequest, res, next));
// GET /users - Fetch all users
router.get('/customers', (req, res, next) => authController.getAllCustomers(req, res, next));

export default router;