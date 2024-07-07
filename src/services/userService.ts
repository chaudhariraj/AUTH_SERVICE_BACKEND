import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import { userData } from "../types";

export class UserService {
    constructor(private userRepository: Repository<User>) { }

    async create({ firstName, LastName, email, password }: userData) {
        //user db store use repositry provied by type ORM
        await this.userRepository.save({ firstName, LastName, email, password });
    }
}