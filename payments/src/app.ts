import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler, currentUser } from '@opasnikod/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); // trust first proxy
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieSession({
    signed: false,
    secure: false,// process.env.NODE_ENV !== "test"
}))

app.use(currentUser);
app.use(createChargeRouter);
app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };