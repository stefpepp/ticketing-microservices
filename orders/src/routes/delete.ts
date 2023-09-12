import express, { Response, Request } from 'express';
import { NotFoundError, NotAuthorizedError, OrderStatus, requireAuth } from '@opasnikod/common';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId != req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.CANCELLED;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    })

    res.status(204).send(order);
});

export { router as deleteOrderRouter };