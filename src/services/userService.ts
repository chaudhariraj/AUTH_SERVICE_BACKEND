import { Repository } from "typeorm";
import { User } from "../entity/User";
import { userData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";
import bcrypt from "bcrypt";

export class UserService {
    constructor(private userRepository: Repository<User>) { }

    // async create({ firstName, lastName, email, password }: userData) {


    //     try {
    //         const userEmail = await this.userRepository.findOne({
    //             where: { email: email }
    //         })
    //         // Hash the password
    //         const saltRounds = 10;
    //         const hashedPassword = await bcrypt.hash(password, saltRounds);

    //         // Create user instance
    //         const user = this.userRepository.create({
    //             firstName,
    //             lastName,
    //             email,
    //             password: hashedPassword,
    //             role: Roles.CUSTOMER
    //         });
    //         if (userEmail) {
    //             const err = createHttpError(400, "Email is already exists!")
    //             throw err;
    //         }
    //         const savedUser = await this.userRepository.save(user);
    //         return savedUser;
    //     } catch (err) {
    //         console.log(err);
    //         const error = createHttpError(500, "Failed to store the data in the database.");
    //         throw error;
    //     }
    // }

    async create({ firstName, lastName, email, password }: userData) {
        try {
            const existingUser = await this.userRepository.findOne({ where: { email } });
            if (existingUser) {
                throw createHttpError(400, "Email already exists!");
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = this.userRepository.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: Roles.CUSTOMER,
            });

            return await this.userRepository.save(user);
        } catch (err) {
            console.error(err);
            throw err; 
            //console.error(err);
            //throw createHttpError(500, "Failed to store the data in the database.");
        }
    }


    async getAllUsers() {
        try {
            const users = await this.userRepository.find();
            console.log("Users >>>>><><><>><><><>>><><", users)
            return users;
        } catch (err) {
            console.error('Failed to fetch users from the database:', err);
            throw new Error('Failed to fetch users from the database.');
        }
    }
}
