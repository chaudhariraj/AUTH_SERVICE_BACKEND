import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Roles } from "../constants";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique:true})
    email: string;
    
    @Column()
    password: string;

    @Column({ default: Roles.CUSTOMER })
    role: string;

}
