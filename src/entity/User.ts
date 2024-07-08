import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    LastName: string;

    @Column()
    email: string;
    
    @Column()
    password: string;

    @Column()
    role: string;

}
