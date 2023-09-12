import { Publisher, ExpirationCompletedEvent, Subjects } from "@opasnikod/common";


export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    readonly subject = Subjects.ExpirationCompleted;
}