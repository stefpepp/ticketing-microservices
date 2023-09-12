import { app } from './app'
import mongoose from 'mongoose'

const start = async () => {
    console.log('starting up the server....');
    if (!process.env.JWT_KEY) {
        throw new Error(' JWT_KEY must be defined')
    }
    if (!process.env.MONGO_URI) {
        throw new Error(' MONGO_URI must be defined')
    }
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to Mongo DB');
    } catch (err) {
        console.error('Unsuccessful connection to db', err);
    }
    app.listen(3000, () => {
        console.log('Listening on port: 3000!!');
    });
}

start();