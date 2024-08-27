import { NextFunction, Request, Response } from "express";
import { AuthRequest, RegisterUserRequest } from "../types";
import { UserService } from "../services/userService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CredentialService } from "../services/CredentialService";
import { JwtPayload, sign } from "jsonwebtoken";
import fs from 'fs';
import path from "path";
import { Config } from "../config";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import { TokenService } from "../services/TokenService";

export class AuthController {
    constructor(private userService: UserService, private logger: Logger, private tokenService: TokenService, private credentialService: CredentialService) {
        this.userService = userService;
    }

    async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;

        this.logger.debug("New request to register a user", { firstName, lastName, email, password: "******" });

        try {
            const user = await this.userService.create({ firstName, lastName, email, password });
            this.logger.info("User has been registered", { id: user.id });
            res.status(201).json({ id: user.id });

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
                // firstName: user.firstName,
                // lastName: user.lastName,
                // email: user.email,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);
            const newRefreshToken = await this.tokenService.persistRefreshToken(user);
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie("accessToken", accessToken, {
                domain: 'localhost',
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24, // 1d
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: 'localhost',
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                httpOnly: true,
            });

        } catch (err) {
            next(err); // Pass the error to the error handling middleware.
        }
    }

    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, password } = req.body;

        this.logger.debug("New request to login a user", { email, password: "******" });

        //login logic - Check the email is exit in the database.
        //Compared password
        //Generate tokens
        //Add tokens to cookies
        //Return the response (id)

        try {
            const user = await this.userService.findByEmail(email)
            this.logger.info("User has been login", { id: user });
            if (!user) {
                const error = createHttpError(400, 'Email or password dose not match');
                next(error)
                return;
            }

            const passwordMatch = await this.credentialService.comparePassword(password, user.password);

            if (!passwordMatch) {
                const error = createHttpError(400, 'Email or password dose not match');
                next(error);
                return;
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
                // firstName: user.firstName,
                // lastName: user.lastName,
                // email: user.email,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);
            //persist the refresh token
            const newRefreshToken = await this.tokenService.persistRefreshToken(user);
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie("accessToken", accessToken, {
                domain: 'localhost',
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24, // 1d
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: 'localhost',
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                httpOnly: true,
            });

            res.json({ id: user.id });

        } catch (err) {
            next(err); // Pass the error to the error handling middleware.
        }

    }

    async self(req: AuthRequest, res: Response){
        //token req.auth.sub
        const user = await this.userService.findById(Number(req.auth.sub))
        res.json({...user, password: undefined});
    }

    // async refresh(req: AuthRequest, res: Response){
    //     res.json({});
    // }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload); 

            const user = await this.userService.findById(Number(req.auth.sub));
            if (!user) {
                const error = createHttpError(
                    400,
                    "User with the token could not find",
                );
                next(error);
                return;
            }

            // Persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            // Delete old refresh token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1h
                httpOnly: true, // Very important
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1y
                httpOnly: true, // Very important
            });

            this.logger.info("User has been logged in", { id: user.id });
            res.json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));
            this.logger.info("Refresh token has been deleted", {
                id: req.auth.id,
            });
            this.logger.info("User has been logged out", { id: req.auth.sub });

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            res.json({});
        } catch (err) {
            next(err);
            return;
        }
    }

    async getAllCustomers(req: Request, res: Response, next: NextFunction) { 
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }
}
