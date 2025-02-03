import { BuyerModel } from "../models/buyer-schema.js"

async function getBuyerByUsername(username) {
    const buyer = await BuyerModel.find({ username }).exec();
    return buyer;
}

async function getBuyerByEmail(email) {
    const buyer = await BuyerModel.find({ email }).exec();
    return buyer;
}

async function getRandomBuyers(count) {
    const buyers = await BuyerModel.aggregate([{ $sample: { size: count } }]);
    return buyers;
}

async function createBuyer(buyerData) {
    const checkIfBuyerExist = await getBuyerByEmail(`${buyerData.email}`);
    if (!checkIfBuyerExist.length) {
        await BuyerModel.create(buyerData);
        
    }
}

async function updateBuyerIsSellerProp(buyerEmail) {
    await BuyerModel.updateOne(
        { email: buyerEmail },
        {
            $set: {
                isSeller: true
            }
        }
    ).exec();
}


async function updateBuyerPurchasedGigsProp(buyerId, purchasedGigId, type) {
    await BuyerModel.updateOne(
        { _id: buyerId },
        type === 'purchased-gig' ?
            {
                $push: {
                    purchasedGigs: purchasedGigId
                }
            } : {
                $pull: {
                    purchasedGigs: purchasedGigId
                }
            }

    ).exec();
}


export {
    getBuyerByUsername,
    getBuyerByEmail,
    getRandomBuyers,
    createBuyer,
    updateBuyerIsSellerProp,
    updateBuyerPurchasedGigsProp

}