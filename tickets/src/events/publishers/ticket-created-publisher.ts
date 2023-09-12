import { Publisher, Subjects, TicketCreatedEvent } from '@opasnikod/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}