import { OrderCancelledEvent, Publisher, Subjects } from "@opasnikod/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}