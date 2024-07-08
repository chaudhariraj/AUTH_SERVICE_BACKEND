import { Repository } from "typeorm";
import { User } from "../entity/User";
import { userData } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, LastName, email, password }: userData) {
        try {
             //user db store use repositry provied by type ORM //Main Query
             const user = this.userRepository.create({ firstName, LastName, email, password, role: Roles.CUSTOMER  });
             console.log("User to be saved:", user);
             const savedUser = await this.userRepository.save(user);
             console.log("User saved:", savedUser);
             return savedUser;
        } catch (err) {
            const error = createHttpError(500, "Failed to store the data in the database.");
            throw error;
        }
    }
}
