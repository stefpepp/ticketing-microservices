import request from 'supertest';
import { app } from '../../app';


it('Fails to sign in when email that does not exist is supplied', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'testjest.com',
            password: "test"
        })
        .expect(400);
});

it('Expect to sign in when email and password are valid', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@jest.com',
            password: "test"
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@jest.com',
            password: "test"
        })
        .expect(200);
});

it('Responds with a cookie on successful login', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@jest.com',
            password: 'test',
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@jest.com',
            password: "test"
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});