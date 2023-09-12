import express, { Response, Request } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@opasnikod/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:id', requireAuth, [
    body('ticketId')
        .notEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Valid order id must be provided')
], async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId != req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    res.status(200).send(order);
});

export { router as showOrderRouter };