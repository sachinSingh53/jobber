import { SellerModel } from '../models/seller-schema.js'
import { updateBuyerIsSellerProp } from './buyer-service.js';


async function getSellerById(sellerId) {
    const seller = await SellerModel.findById(sellerId).exec();
    return seller;
}

async function getSellerByUsername(username) {
    const seller = await SellerModel.findOne({ username }).exec();
    return seller;
}

async function getSellerByEmail(email) {
    const seller = await SellerModel.findOne({ email }).exec();
    return seller;
}

async function getRandomSellers(count) {
    const sellers = await SellerModel.aggregate([{ $sample: { size: count } }]);

    return sellers;
}

async function createSeller(sellerData) {
    const createdSeller = await SellerModel.create(sellerData);
    await updateBuyerIsSellerProp(`${createSeller.email}`);

    return createdSeller;
}

async function updateSeller(sellerId, sellerData) {
    const updatedSeller = await SellerModel.findOneAndUpdate(
        { _id: sellerId },
        {
            $set: {
                profilePublicId: sellerData.profilePublicId,
                fullName: sellerData.fullName,
                profilePicture: sellerData.profilePicture,
                description: sellerData.description,
                country: sellerData.country,
                skills: sellerData.skills,
                oneliner: sellerData.oneliner,
                languages: sellerData.languages,
                responseTime: sellerData.responseTime,
                experience: sellerData.experience,
                education: sellerData.education,
                socialLinks: sellerData.socialLinks,
                certificates: sellerData.certificates
            }
        },
        { new: true }
    ).exec();
    return updatedSeller;
}


async function updateTotalGigsCount(sellerId, count) {
    await SellerModel.updateOne({ _id: sellerId }, { $inc: { totalGigs: count } }).exec();
};

async function updateSellerOngoingJobsProp(sellerId, ongoingJobs) {
    await SellerModel.updateOne({ _id: sellerId }, { $inc: { ongoingJobs } }).exec();
};


async function updateSellerCancelledJobsProp(sellerId) {
    await SellerModel.updateOne({ _id: sellerId }, { $inc: { ongoingJobs: -1, cancelledJobs: 1 } }).exec();
};

async function updateSellerCompletedJobsProp(data) {
    const { sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery } = data;
    await SellerModel.updateOne(
        { _id: sellerId },
        {
            $inc: {
                ongoingJobs,
                completedJobs,
                totalEarnings
            },
            $set: { recentDelivery: new Date(recentDelivery) }
        }
    ).exec();
};

async function updateSellerReview(data) {
    const ratingTypes = {
        '1': 'one',
        '2': 'two',
        '3': 'three',
        '4': 'four',
        '5': 'five',
    };
    const ratingKey = ratingTypes[`${data.rating}`];
    await SellerModel.updateOne(
        { _id: data.sellerId },
        {
            $inc: {
                ratingsCount: 1,
                ratingSum: data.rating,
                [`ratingCategories.${ratingKey}.value`]: data.rating,
                [`ratingCategories.${ratingKey}.count`]: 1,
            }
        }
    ).exec();
};

export {
    getSellerById,
    getSellerByUsername,
    getSellerByEmail,
    getRandomSellers,
    createSeller,
    updateSeller,
    updateTotalGigsCount,
    updateSellerOngoingJobsProp,
    updateSellerCancelledJobsProp,
    updateSellerCompletedJobsProp,
    updateSellerReview
}