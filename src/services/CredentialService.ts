import bcrypt from "bcrypt";

export class CredentialService {
    async comparePassword(userPassword: string, passwordHash: string) {
        return await bcrypt.compare(userPassword, passwordHash); //It will return boolean true and false 
    }
}
