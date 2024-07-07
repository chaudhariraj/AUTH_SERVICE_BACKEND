import request from 'supertest';
import app from '../../src/app'
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTable } from '../utils';
import { User } from '../../src/entity/User';

describe("POST /auth/register", () => {
    let dataSource: DataSource;

    beforeAll( async () => {
        dataSource =  await AppDataSource.initialize();
    })

    beforeEach(async () => {
        await truncateTable(dataSource);
        //Database truncate

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
})
describe("Fields are missing", () => {});