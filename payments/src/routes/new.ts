import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, validateRequest } from '@opasnikod/common';
import { requireAuth } from '@opasnikod/common';
import { Order } from '../models/Order';
import { CURRENCIES } from '../fake_libs/stripe-type';
import { fakeStripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.post('/api/payments', requireAuth,
    [body('token')
        .notEmpty()
        .withMessage('Token is required'),
    body('orderId')
        .notEmpty()
        .withMessage('Order id must be provided')]
    , validateRequest,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.body.orderId);
        if (!order) {
            throw new NotFoundError();
        }
        if (req.currentUser!.id !== order.userId) {
            throw new NotAuthorizedError();
        }
        if (order.status === OrderStatus.CANCELLED) {
            throw new BadRequestError('Cannont pay for cancelled order');
        }
        const charge = await fakeStripe.charges.create({
            currency: CURRENCIES.USD,
            amount: order.price * 100,
            source: req.body.token
        });
        if (charge.status === 'OK') {
            const payment = Payment.build({
                orderId: order.id,
                stripeId: charge.id
            })

            await payment.save();
            new PaymentCreatedPublisher(natsWrapper.client).publish({
                id: payment.id,
                orderId: payment.orderId,
                stripeId: payment.stripeId
            });

            res.status(201).send({ id: payment.id });
        } else {
            throw new BadRequestError(charge.errors[0].message);
        }
    });

export { router as createChargeRouter };