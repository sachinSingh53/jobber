
import mongoose, { Schema } from 'mongoose';

const gigSchema = new Schema(
    {
        sellerId: { type: Schema.Types.ObjectId, index: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        basicTitle: { type: String, required: true },
        basicDescription: { type: String, required: true },
        categories: { type: String, required: true },
        subCategories: [{ type: String, required: true }],
        tags: [{ type: String }],
        active: { type: Boolean, default: true },
        expectedDelivery: { type: String, default: '' },
        ratingsCount: { type: Number, default: 0 },
        ratingsSum: { type: Number, default: 0 },
        ratingCategories: {
            five: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
            four: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
            three: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
            two: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
            one: { value: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
        },
        price: { type: Number, default: 0 },
        sortId: { type: Number },
        coverImage: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    },
    {
        versionKey:false,

        //this will delete the _id field from the mongoose document and change it to id.
        
        /*we are doing this because we are storing this gig in elasticsearch as well and elasticsearch also contains the _id
        property so without doing this it will create a conflict*/
        toJSON:{
            transform(_doc,rec){
                rec.id = rec._id;
                delete rec._id;
                return rec;
            }
        }
    }
);

gigSchema.virtual('id').get(function(){
    return this._id;
})



const GigModel = mongoose.model('Gig',gigSchema);

export {GigModel}