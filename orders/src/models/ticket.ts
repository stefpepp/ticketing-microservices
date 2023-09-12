import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    findByEvent(data: { id: string, version: number }): Promise<TicketDoc | null>;
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = async (data: { id: string, version: number }): Promise<TicketDoc | null> => {
    return Ticket.findOne({ _id: data.id, version: data.version - 1 });
}
ticketSchema.statics.build = (attrs: TicketAttrs): TicketDoc => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    })
}

ticketSchema.methods.isReserved = async function (): Promise<boolean> {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.AWAITING_PAYMENT,
                OrderStatus.CREATED,
                OrderStatus.COMPLETED,
            ]
        }
    })
    return !!existingOrder;
}



const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };