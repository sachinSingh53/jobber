import { pool } from '../database.js'
import { publishFanoutMessage } from '../queues/review-publisher.js';
import { reviewChannel } from '../app.js'
import { query } from 'express';
// import { map } from 'lodash';

const addReview = async (data) => {
    const {
        gigId,
        reviewerId,
        reviewerImage,
        sellerId,
        review,
        rating,
        orderId,
        reviewType,
        reviewerUsername,
        country
    } = data;

    const createdAtDate = new Date();

    const { rows } = await pool.query(
        `INSERT INTO reviews (gigId,reviewerId,reviewerImage,sellerId,review,rating,orderId,reviewType,reviewerUsername,country,createdAt)
        VALUES($1,$2,$2,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *
        `,
        [gigId, reviewerId, reviewerImage, sellerId, review, rating, orderId, reviewType, reviewerUsername, country, createdAtDate]
    );



    const messageDetails = {
        gigId: data.gigId,
        reviewerId: data.reviewerId,
        sellerId: data.sellerId,
        review: data.review,
        rating: data.rating,
        orderId: data.orderId,
        createdAt: `${createdAtDate}`,
        type: `${reviewType}`
    };


    await publishFanoutMessage(
        reviewChannel,
        'jobber-review',
        JSON.stringify(messageDetails),
        'Review details sent to order and users services'
    );

    const result = Object.fromEntries(
        Object.entries(rows[0]).map(([key, value]) => [objKeys[key] || key, value])
    );
    return result;

}

const getReviewsByGigId = async (gigId) => {
    const reviews = await pool.query(
        `SELECT * FROM reviews WHERE reviews.gigId = $1`,
        [gigId]
    )

    return reviews.rows;
}

const getReviewsBySellerId = async (sellerId) => {
    const reviews = await pool.query(
        `SELECT * FROM reviews WHERE reviews.sellerId = $1 AND reviews.reviewType = $2`,
        [sellerId, 'seller-review']
    )

    return reviews.rows;
}

export {
    addReview,
    getReviewsByGigId,
    getReviewsBySellerId
}