import { OrderCreatedEvent, Publisher, Subjects } from "@opasnikod/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}