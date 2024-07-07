import request from 'supertest';
import app from '../../src/app'

describe("POST /auth/register", () => {
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
    })
})
describe("Fields are missing", () => {});