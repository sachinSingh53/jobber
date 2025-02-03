import { addDataToIndex, deleteIndexedData, getIndexedData, updateIndexedData } from "../elasticsearch.js"
import { gigsSearchBySellerId } from "./search-service.js";
import { GigModel } from '../models/gig.schema.js'
import { publishDirectMessage } from '../queues/gig-producer.js'
import { gigChannel } from '../app.js'
import {faker} from '@faker-js/faker'

const getGigById = async (gigId) => {
    const gig = getIndexedData('gigs', gigId);
    return gig;
}

const getSellerGigs = async (sellerId) => {
    const gigs = await gigsSearchBySellerId(`${sellerId}`, true);

    let resultHits = [];

    for (let item of gigs.hits) {
        resultHits.push(item._source);
    }
    return resultHits;
}
const getSellerInactiveGigs = async (sellerId) => {
    const gigs = await gigsSearchBySellerId(`${sellerId}`, false);

    let resultHits = [];
    

    for (let item of gigs.hits) {
        resultHits.push(item._source);
    }

    return resultHits;
}

const createGig = async (gigData) => {
    const createdGig = await GigModel.create(gigData);
    // ?. is an optional chaining
    if (createdGig) {
        //this will channge _id to id
        const data = createdGig.toJSON?.();
        const message = {
            type: 'update-gig-count',
            gigSellerId: `${data.sellerId}`,
            count: 1
        }
        await publishDirectMessage(
            gigChannel,
            'jobber-seller-updates',
            'user-seller',
            JSON.stringify(message),
            'details sent to userService'
        )
        await addDataToIndex('gigs', `${data.id}`, data);
    }

    return createdGig;
}
const deleteGig = async (gigId, sellerId) => {
    await GigModel.findByIdAndDelete(gigId);
    await deleteIndexedData('gigs', gigId);
    const message = {
        gigSellerId: sellerId,
        count: -1,
        type: 'update-gig-count'
    }
    publishDirectMessage(
        gigChannel,
        'jobber-seller-updates',
        'user-seller',
        JSON.stringify(message),
        'details sent to userService'
    )


}

const updateGig = async (gigId, gigData) => {
    const document = await GigModel.findOneAndUpdate(
        { _id: gigId },
        {
            $set: {
                title: gigData.title,
                description: gigData.description,
                categories: gigData.categories,
                subCategories: gigData.subCategories,
                tags: gigData.tags,
                price: gigData.price,
                coverImage: gigData.coverImage,
                expectedDelivery: gigData.expectedDelivery,
                basicTitle: gigData.basicTitle,
                basicDescription: gigData.basicDescription
            }
        },
        { new: true }
    )

    if (document) {
        const data = document.toJSON?.();
        await updateIndexedData('gigs', `${data.id}`, data);
    }
}
const updateActiveGigProp = async (gigId, isActive) => {

    const document = await GigModel.findOneAndUpdate(
        { _id: gigId },
        {
            $set: {
                active: isActive
            }
        },
        { new: true }
    )



    if (document) {
        const data = document.toJSON?.();
        await updateIndexedData('gigs', `${data.id}`, data);
    }
}


async function updateGigReview(data) {
    const ratingTypes = {
        '1': 'one',
        '2': 'two',
        '3': 'three',
        '4': 'four',
        '5': 'five',
    };
    const ratingKey = ratingTypes[`${data.rating}`];
    const gig = await GigModel.updateOne(
        { _id: data.gigId },
        {
            $inc: {
                ratingsCount: 1,
                ratingSum: data.rating,
                /*  
                    The values inside the square brackets are template literals,which allow for string interpolation.
                    This means that ${ratingKey} is replaced by the value of the ratingKey variable,
                    forming a dynamic property key.
                */
                [`ratingCategories.${ratingKey}.value`]: data.rating,
                [`ratingCategories.${ratingKey}.count`]: 1,
            }
        },
        { new: true, upsert: true }
    ).exec();
    if (gig) {
        const data = document.toJSON?.();
        await updateIndexedData('gigs', `${data.id}`, data);
    }
};


const seedData = async (sellers, count) => {
    const categories = [
        'Graphics & Design',
        'Digital Marketing',
        'Writing & Translation',
        'Video & Animation',
        'Music & Audio',
        'Programming & Tech',
        'Data',
        'Business'
    ];
    const expectedDelivery = [
        '1 Day Delivery',
        '2 Days Delivery',
        '3 Days Delivery',
        '4 Days Delivery',
        '5 Days Delivery',
    ];
    const randomRatings = [
        { sum: 20, count: 4 },
        { sum: 10, count: 2 },
        { sum: 20, count: 4 },
        { sum: 15, count: 3 },
        { sum: 5, count: 1 },
    ];

    for (let i = 0; i < sellers.length; i++) {
        const sellerDoc = sellers[i];
        const title = `I will ${faker.lorem.word()} ${faker.lorem.word()} ${faker.lorem.word()} ${faker.lorem.word()} ${faker.lorem.word()}`;
        const basicTitle = faker.commerce.productName();
        const basicDescription = faker.commerce.productDescription();
        const rating = randomRatings[Math.floor(Math.random() * randomRatings.length)];
        const gig = {
            sellerId: sellerDoc._id,
            email: sellerDoc.email,
            username: sellerDoc.username,
            title: title.length <= 80 ? title : title.slice(0, 80),
            basicTitle: basicTitle.length <= 40 ? basicTitle : basicTitle.slice(0, 40),
            basicDescription: basicDescription.length <= 100 ? basicDescription : basicDescription.slice(0, 100),
            categories: `${categories[Math.floor(Math.random() * categories.length)]}`,
            subCategories: [faker.commerce.department(), faker.commerce.department(), faker.commerce.department()],
            description: faker.lorem.sentences({ min: 2, max: 4 }),
            tags: [faker.commerce.product(), faker.commerce.product(), faker.commerce.product(), faker.commerce.product()],
            price: parseInt(faker.commerce.price({ min: 20, max: 30, dec: 0 })),
            coverImage: faker.image.url(),
            expectedDelivery: `${expectedDelivery[Math.floor(Math.random() * expectedDelivery.length)]}`,
            sortId: parseInt(count, 10) + i + 1,
            ratingsCount: (i + 1) % 4 === 0 ? rating.count : 0,
            ratingSum: (i + 1) % 4 === 0 ? rating.sum : 0,
        };
        console.log(`***SEEDING GIG*** - ${i + 1} of ${count}`);
        await createGig(gig);
    }
};






export {
    getGigById,
    getSellerGigs,
    getSellerInactiveGigs,
    createGig,
    deleteGig,
    updateGig,
    updateActiveGigProp,
    updateGigReview,
    seedData
}