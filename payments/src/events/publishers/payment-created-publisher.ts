import { Publisher, PaymentCreatedEvent, Subjects } from "@opasnikod/common"

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}