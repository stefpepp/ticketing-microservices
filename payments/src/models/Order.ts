import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@opasnikod/common";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.CREATED
    }
}, {
    toJSON: {
        transform: (doc: any, ret: any) => {
            ret.id = doc._id;
            delete ret._id
            return ret;
        }
    }
});

orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.set('versionKey', 'version');

orderSchema.statics.build = function (attrs: OrderAttrs) {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        userId: attrs.userId,
        status: attrs.status,
        price: attrs.price,
    });
}

interface OrderAttrs {
    id: string;
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };