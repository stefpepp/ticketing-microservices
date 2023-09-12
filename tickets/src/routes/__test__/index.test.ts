import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'test', price: 10 })
    .expect(201);

it('returns a array of tickets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get('/api/tickets')
        .expect(200);
    expect(response.body.length).toEqual(3);
});