import { app } from './app';
import mongoose from 'mongoose';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { natsWrapper } from './nats-wrapper';
import { ExpirationCompletedListener } from './events/listeners/expiration-completed-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const start = async () => {
    console.log('starting up the server....');
    if (!process.env.JWT_KEY) {
        throw new Error(' JWT_KEY must be defined')
    }
    if (!process.env.MONGO_URI) {
        throw new Error(' MONGO_URI must be defined')
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error(' NATS_CLUSTER_ID must be defined')
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error(' NATS_CLIENT_ID must be defined')
    }
    if (!process.env.NATS_URL) {
        throw new Error(' NATS_URL must be defined')
    }
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
        natsWrapper.client.on('close', () => {
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Mongo DB');

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompletedListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

    } catch (err) {
        console.error('Unsuccessful connection to db', err);
    }
    app.listen(3000, () => {
        console.log('Listening on port: 3000!');
    });
}

start();