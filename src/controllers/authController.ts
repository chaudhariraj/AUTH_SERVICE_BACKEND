import { NextFunction, Request, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/userService";
import { Logger } from "winston";

export class AuthController {
    constructor(private userService: UserService, private logger: Logger) {
        this.userService = userService;
    }

    // async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    //     const { firstName, lastName, email, password } = req.body;
    //     this.logger.debug("New request to register a user", { firstName, lastName, email, password: "******" });

    //     try {
    //         const user = await this.userService.create({ firstName, lastName, email, password });
    //         this.logger.info("User has been registered", { id: user.id });
    //         res.status(201).json({ id: user.id });
    //     } catch (err) {
    //         next(err);
    //         return;
    //     }
    // }

    async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body;
        this.logger.debug("New request to register a user", { firstName, lastName, email, password: "******" });

        try {
            const user = await this.userService.create({ firstName, lastName, email, password });
            this.logger.info("User has been registered", { id: user.id });
            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err); // Pass the error to the error handling middleware
        }
    }
    async getAllCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAllUsers();
            console.log("Users<>><>><><>><",users)
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }


    }
}
