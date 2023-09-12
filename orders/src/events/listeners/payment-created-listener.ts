import { Listener, PaymentCreatedEvent, Subjects, OrderStatus } from "@opasnikod/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error(`Not found order by id: ${data.orderId}`);
        }

        order.set({ status: OrderStatus.COMPLETED });
        await order.save();

        msg.ack();
    }
}