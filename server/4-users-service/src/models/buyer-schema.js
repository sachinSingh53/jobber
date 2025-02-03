import mongoose, { Schema, version } from "mongoose";

const buyerSchema = new Schema(
    {
        username: { type: String, required: true, index: true },
        email: { type: String, required: true, index: true },
        isSeller: { type: Boolean, default: false },
        purchasedGigs: [{
            type: Schema.Types.ObjectId,
            ref: 'Gig'
        }],
        createdAt: { type: Date }

    },
    {
        // this is used so that mongodb will not send _v property in the data
        versionKey: false
    }
);

const BuyerModel = mongoose.model('Buyer', buyerSchema);

export { BuyerModel };