import { Publisher, Subjects, TicketUpdatedEvent } from '@opasnikod/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}