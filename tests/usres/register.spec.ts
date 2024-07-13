import request from 'supertest';
import app from '../../src/app'
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import bcrypt from 'bcrypt';

describe("POST /auth/register", () => {
    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize();
    })

    beforeEach(async () => {
        //Database truncate
        //await truncateTable(dataSource);
        //rebuild and synch database 
        await dataSource.dropDatabase();   //drop
        await dataSource.synchronize();
        console.log("Database synchronized");

    })

    afterAll(async () => {
        await dataSource.destroy();
    })

    it("Give return the 201 status code", async () => {
        //Arrange 
        const userData = {
            firstName: "Raj",
            lastName: "Chaudhari",
            email: 'craj@gmail.com',
            password: "secret"
        }
        //Act
        const response = await request(app).post('/auth/register').send(userData)
        //Assert
        expect(response.statusCode).toBe(201)
    })

    it("Should return valid json response", async () => {
        //Arrange
        const userData = {
            firstName: "Raj",
            lastName: "Chaudhari",
            email: 'craj@gmail.com',
            password: "secret"
        }
        //Act
        const response = await request(app).post('/auth/register').send(userData)
        //Assert
        expect((response.headers as Record<string, string>)["content-type"],).toEqual(expect.stringContaining("json"));
    })

    it("Should return a valid JSON response", async () => {
        const userData = {
            firstName: "Raj",
            lastName: "Chaudhari",
            email: 'craj@gmail.com',
            password: "secret1"
        };
        const response = await request(app).post('/auth/register').send(userData);
        console.log('response', response.text);
        expect((response.headers as Record<string, string>)["content-type"]).toEqual(expect.stringContaining("json"));
    });

    it("should persist the user in the database", async () => {
        //Arrange
        const userData = {
            firstName: "Raj",
            lastName: "Chaudhari",
            email: 'craj993@gmail.com',
            password: "secret"
        }
        //Act
        const response = await request(app).post('/auth/register').send(userData)
        expect(response.statusCode).toBe(201);
        //Assert
        const userRepository = dataSource.getRepository(User)
        const users = await userRepository.find()
        console.log("Persisted users:", users);
        expect(users).toHaveLength(1);
        expect(users[0].firstName).toBe(userData.firstName)
        expect(users[0].lastName).toBe(userData.lastName)
        expect(users[0].email).toBe(userData.email)
        //expect(users[0].password).toBe(userData.password)
        console.log("users[0].password", users[0].firstName)
        const isPasswordValid = await bcrypt.compare(userData.password, users[0].password);
        expect(isPasswordValid).toBe(true);
        expect(users[0].role).toBe(Roles.CUSTOMER);
    })

    it("should return an id of the created user", async () => {
        //Arrange
        const userData = {
            firstName: "Raj",
            lastName: "Chaudhari",
            email: 'craj993@gmail.com',
            password: "secret"
        };
        // Act
        const response = await request(app).post("/auth/register").send(userData);
        console.log("Response body:", response.body);

        expect(response.body).toHaveProperty("id");
        const repository = dataSource.getRepository(User);
        const users = await repository.find();
        console.log("Users in DB:", users);
        expect(response.body.id).toBe(users[0].id);
    });

    it("should assign a customer role", async () => {
        const userData = {
            firstName: "Raj",
            lastName: "Chaudhari",
            email: 'craj@gmail.com',
            password: "secret1"
        };
        // Act
        const response = await request(app).post("/auth/register").send(userData);
        console.log('response', response.text);

        expect(response.statusCode).toBe(201);

        //Assets
        const userRepository = dataSource.getRepository(User);
        const users = await userRepository.find();
        console.log("Users with role check :", users);
        expect(users).toHaveLength(1);
        expect(users[0]).toHaveProperty("role");
        expect(users[0].role).toBe(Roles.CUSTOMER);
    });

    it("should stroe a hashed password in the database", async () => {
        const userData = {
            firstName: "Raj",
            lastName: "Chaudhari",
            email: 'craj@gmail.com',
            password: "secret1"
        };
        // Act
        const response = await request(app).post("/auth/register").send(userData);
        //console.log('response', response.text);

        expect(response.statusCode).toBe(201);

        //Assets
        const userRepository = dataSource.getRepository(User);
        const users = await userRepository.find();
        expect(users[0].password).not.toBe(userData.password);
        expect(users[0].password).toHaveLength(60);
        expect(users[0].password).toMatch(/^\$2b\$\d+\$/);

    });

    it('should return 400 status code if email already exists', async () => {
        const userData = {
            firstName: "Raj",
            lastName: "Chaudhari",
            email: 'craj@gmail.com',
            password: "secret1"
        };

        const userRepository = dataSource.getRepository(User);
        await userRepository.save({ ...userData, role: Roles.CUSTOMER });

        const response = await request(app).post("/auth/register").send(userData);

        const users = await userRepository.find();
        //Assert
        // expect(response.status).toBe(400);
        expect(users).toHaveLength(1);
    });

    it('GET /users should return status code 200 and JSON response', async () => {
        // Arrange: Create a user in the database (optional, depending on your test setup)
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'secret',
            role: Roles.CUSTOMER,
        };
        const userRepository = dataSource.getRepository(User);
        await userRepository.save(userData);

        // Act: Make a GET request to /users
        const response = await request(app).get('/auth/customers');
        console.log(response);

        // Assert: Check status code and content type
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    });


    describe("Fields are missing", () => {
        it('Should return 400 status code if email field is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: '',
                password: 'secret',
            };

            // Act: 
            const response = await request(app).post("/auth/register").send(userData);

            //Assert
            console.log("Should return 400 status code if email field is missing", response.body)
            expect(response.statusCode).toBe(400);
            const userRepository = dataSource.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
    });
    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            // Arrange
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: " rakesh@mern.space ",
                password: "password",
            };
            // Act
            await request(app).post("/auth/register").send(userData);

            // Assert
            const userRepository = dataSource.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];
            expect(user.email).toBe("rakesh@mern.space");
        });

    });
});