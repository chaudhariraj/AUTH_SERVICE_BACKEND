import request from 'supertest';
import app from '../../src/app'
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
// import { truncateTable } from '../utils';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe("POST /auth/register", () => {
    let dataSource: DataSource;

    beforeAll( async () => {
        dataSource =  await AppDataSource.initialize();
    })

    beforeEach(async () => {
        //Database truncate
        await dataSource.dropDatabase();
        await dataSource.synchronize();
         //await truncateTable(dataSource);

    })

    afterAll(async () => {
        await dataSource.destroy();
    })

    it("Give return the 201 status code", async () => {
        //Arrang
        const userData = {
            firstName: "Raj",
            LastName: "Chaudhari",
            email:'craj993@gmail.com',
            password:"secret"
        }
        //Act
        const response = await request(app).post('/auth/register').send(userData)
        //Assert
        expect(response.statusCode).toBe(201)
    })

    it("Should return valid json response", async ()=> {
        //Arrang
        const userData = {
            firstName: "Raj",
            LastName: "Chaudhari",
            email:'craj993@gmail.com',
            password:"secret"
        }
        //Act
        const response = await request(app).post('/auth/register').send(userData)
        //Assert
        expect((response.headers as Record<string, string>)["content-type"], ).toEqual(expect.stringContaining("json"));
    })

    it("should persist the user in the database", async () => {
         //Arrang
         const userData = {
            firstName: "Raj",
            LastName: "Chaudhari",
            email:'craj993@gmail.com',
            password:"secret"
        }
        //Act
        const response = await request(app).post('/auth/register').send(userData)
        //Assert
        const userRepository = dataSource.getRepository(User)
        const users = await userRepository.find()
        expect(users).toHaveLength(1);  
        expect(users[0].firstName).toBe(userData.firstName)
        expect(users[0].LastName).toBe(userData.LastName)
        expect(users[0].email).toBe(userData.email)
        expect(users[0].password).toBe(userData.password)
    })

    // it("should return an id of the created user", async () => {
    //     // Arrange
    //     const userData = {
    //         firstName: "Rakesh",
    //         lastName: "K",
    //         email: "rakesh@mern.space",
    //         password: "password",
    //     };
    //     // Act
    //     const response = await request(app).post("/auth/register").send(userData);
    //     console.log("Response body:", response.body);

    //     expect(response.body).toHaveProperty("id");
    //     const repository = dataSource.getRepository(User);
    //     const users = await repository.find();
    //     console.log("Users in DB:", users);
    //     expect(response.body.id).toBe(users[0].id);
    // });

    it("should assign a customer role", async () => {
        const userData = {
            firstName: "Rakesh",
            lastName: "K",
            email: "rakesh@mern.space",
            password: "password"
        };

       await request(app).post("/auth/register").send(userData);
 


        const userRepository = dataSource.getRepository(User);
        console.log("Users with role check userRepository:", userRepository);
        const users = await userRepository.find();
        console.log("Users with role check :", users);
        expect(users).toHaveLength(1);
        expect(users[0]).toHaveProperty("role");
        expect(users[0].role).toBe(Roles.CUSTOMER);
    });

})
describe("Fields are missing", () => {});