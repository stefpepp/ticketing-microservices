import { Message } from "node-nats-streaming";
import { Listener, Subjects, TicketCreatedEvent } from "@opasnikod/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
    readonly queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {

        const ticket = Ticket.build({
            id: data.id,
            title: data.title,
            price: data.price
        })

        await ticket.save();

        msg.ack();
    }
}