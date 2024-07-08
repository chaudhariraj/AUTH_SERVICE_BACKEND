import { NextFunction, Response } from "express";
import { RegisterUserRquest } from "../types";
import { UserService } from "../services/userService";
import { Logger } from "winston";


export class AuthController {

    constructor(private userService: UserService, private logger: Logger) {
        this.userService = userService;
    }

    async register(req: RegisterUserRquest, res: Response, next: NextFunction) {
        const { firstName, LastName, email, password } = req.body;
        this.logger.debug("New request to register a user", { firstName, LastName, email, password: "******" });

        try {
            //Create instance of class
            const user = await this.userService.create({ firstName, LastName, email, password })
            this.logger.info("User has been registered", { id: user.id })
            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }


    }
}