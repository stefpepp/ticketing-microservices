import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';


it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .get(`/api/tickets/${id}`).send();

    expect(response.statusCode).toBe(404);
});

it('returns a ticket if the input data was valid', async () => {
    const title = 'test';
    const price = 20;

    const response = await request(app)
        .post('/api/tickets').set("Cookie", signin())
        .send({ title, price })
        .expect(201);

    await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200);

});
