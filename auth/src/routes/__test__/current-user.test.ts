import request from 'supertest';
import { app } from '../../app';

it('Expect to get details from the current user', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@jest.com',
            password: "test"
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    const currentUserResponse = await request(app)
        .get('/api/users/current-user')
        .set('Cookie', cookie)
        .send({})
        .expect(200);

    expect(currentUserResponse.body.currentUser.email).toBe('test@jest.com');
});

it('Responds with null if not authenticated', async () => {
    const currentUserResponse = await request(app)
        .get('/api/users/current-user')
        .send({})
        .expect(200);

    expect(currentUserResponse.body.currentUser).toBe(null);
});