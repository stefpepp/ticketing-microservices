import request from 'supertest';
import { app } from '../../app';

it(' returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@jest.com',
            password: "test"
        })
        .expect(201);
})

it(' returns a 400 with invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testjest.com',
            password: "test"
        })
        .expect(400);
});

it(' returns a 400 with invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@jest.com',
            password: "t"
        })
        .expect(400);
});

it(' returns a 400 when passord or email are missing', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@jest.com',
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'test',
        })
        .expect(400);
});

it('disallows creating accounts with same emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@jest.com',
            password: 'test',
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@jest.com',
            password: 'test',
        })
        .expect(400);
});

it('Cookie is set in response', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@jest.com',
            password: 'test',
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});