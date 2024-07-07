import { Response } from "express";
import { RegisterUserRquest } from "../types";
import { UserService } from "../services/userService";


export class AuthController {

    constructor(private userService: UserService) {
        this.userService = userService;
    } 
    async register(req: RegisterUserRquest, res: Response) {
        const { firstName, LastName, email, password } = req.body;
        //Create instance of class
        await this.userService.create({ firstName, LastName, email, password })
        res.status(201).json();

    }
}