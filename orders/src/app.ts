import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler, currentUser } from '@opasnikod/common';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true); // trust first proxy
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieSession({
    signed: false,
    secure: false,// process.env.NODE_ENV !== "test"
}))

app.use(currentUser);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };