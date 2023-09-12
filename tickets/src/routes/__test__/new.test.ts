import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})

    expect(response.status).not.toEqual(400);
});

it('can only be accessed if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).toEqual(401);
});

it('returns a status different form 401 if a user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({});

    expect(response.status).not.toBe(401);
});

it('returns an error if and invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({ title: '' })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({ price: 10 })
        .expect(400);
});

it('returns an error if and invalid price is provided', async () => {

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({ title: 'mocktitle' })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({ price: -10 })
        .expect(400);
});

it('creates a ticket if a valid input is provided', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toBe(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({ title: 'test', price: 10 })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toBe(1);
});


it('expect that event has been published', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toBe(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({ title: 'test', price: 10 })
        .expect(201);



    tickets = await Ticket.find({});
    expect(tickets.length).toBe(1);
    expect(natsWrapper.client.publish).toHaveBeenCalled();


});
