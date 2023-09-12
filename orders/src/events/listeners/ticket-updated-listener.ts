import { Message } from "node-nats-streaming";
import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from "@opasnikod/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new NotFoundError();
        }

        ticket.set({
            title: data.title,
            price: data.price
        })


        await ticket.save();

        msg.ack();
    }
}