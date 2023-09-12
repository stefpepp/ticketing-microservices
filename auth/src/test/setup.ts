import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app'
import request from 'supertest';

let mongo: any;

declare global {
    var signin: () => Promise<string[]>;
}

// Before everyting else, do this
beforeAll(async () => {
    jest.clearAllMocks();

    const mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
    process.env.JWT_KEY = 'test-secret-key';
});

// Before each test do this
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    // Reset all data between each test that we run
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    if (mongo) {
        await mongo.stop();
    }
});

global.signin = async () => {
    const email = 'test@jest.com';
    const password = 'test';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');
    return cookie;
}