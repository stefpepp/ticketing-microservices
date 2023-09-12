import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongo: any;

declare global {
    var signin: () => string[];
}

// Before everyting else, do this
beforeAll(async () => {
    jest.clearAllMocks();

    const mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
    process.env.JWT_KEY = 'test-secret-key';
});

jest.mock('../nats-wrapper');

// Before each test do this
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    // Reset all data between each test that we run
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
})

global.signin = () => {
    const payload = {
        email: 'test@jest.com',
        id: new mongoose.Types.ObjectId().toHexString()
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: jwtToken };
    const base64 = Buffer.from(JSON.stringify(session)).toString('base64');
    return [`session=${base64}`];
}