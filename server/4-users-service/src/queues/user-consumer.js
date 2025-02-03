import { winstonLogger } from '@sachinsingh53/jobber-shared'
import { createConnection } from './connection.js';
import { createBuyer, updateBuyerPurchasedGigsProp } from '../services/buyer-service.js'
import { getRandomSellers, updateSellerCancelledJobsProp, updateSellerCompletedJobsProp, updateSellerOngoingJobsProp, updateSellerReview, updateTotalGigsCount } from '../services/seller-service.js'
import { publishDirectMessage } from '../queues/user-producer.js'
import config from '../config.js';
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'userServiceConsumer', 'debug');

async function consumeBuyerDirectMessage(channel) {
    try {
        if (!channel) {
            channel = createConnection();
        }

        const exchangeName = 'jobber-buyer-updates';
        const routingKey = 'user-buyer';
        const queueName = 'user-buyer-queue';

        await channel.assertExchange(exchangeName, 'direct');
        const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
        channel.consume(jobberQueue.queue, async (msg) => {
            const { type } = JSON.parse(msg.content.toString());

            if (type === 'auth') {
                const { username, email, createdAt } = JSON.parse(msg.content.toString());
                const buyer = {
                    username,
                    email,
                    purchasedGigs: [],
                    createdAt
                }

                await createBuyer(buyer);
            }
            else {
                const { buyerId, purchasedGigs } = JSON.parse(msg.content.toString());
                await updateBuyerPurchasedGigsProp(buyerId, purchasedGigs, type);
            }

            channel.ack(msg);
        })
    } catch (error) {
        log.log('error', 'UserService UserConsumer consumeBuyerDirectMessage() method error', error);
    }
}

async function consumeSellerDirectMessage(channel) {
    try {
        if (!channel) {
            channel = createConnection();
        }

        const exchangeName = 'jobber-seller-updates';
        const routingKey = 'user-seller';
        const queueName = 'user-seller-queue';

        await channel.assertExchange(exchangeName, 'direct');
        const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
        channel.consume(jobberQueue.queue, async (msg) => {
            const { type, sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery, gigSellerId, count } = JSON.parse(msg.content.toString());
            
            if (type === 'create-order') {
                await updateSellerOngoingJobsProp(sellerId, ongoingJobs);
            }
            else if (type === 'aprove-order') {
                
    

                await updateSellerCompletedJobsProp({
                    sellerId,
                    ongoingJobs,
                    completedJobs,
                    totalEarnings,
                    recentDelivery
                })
            }
            else if (type === 'update-gig-count') {
                await updateTotalGigsCount(`${gigSellerId}`, count);
            }
            else if (type === 'cancel-order') {
                await updateSellerCancelledJobsProp(sellerId);
            }

            channel.ack(msg);

        })

    } catch (error) {
        log.log('error', 'UserService UserConsumer consumeSellerDirectMessage() method error', error);
    }
}

async function consumeReviewFanoutMessage(channel) {
    try {
        if (!channel) {
            channel = createConnection();
        }

        const exchangeName = 'jobber-review';
        const queueName = 'seller-review-queue';

        await channel.assertExchange(exchangeName, 'fanout');
        const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(jobberQueue.queue, exchangeName, '');
        channel.consume(jobberQueue.queue, async (msg) => {
            const { type } = JSON.parse(msg.content.toString());

            if (type === 'buyer-review') {
                await updateSellerReview(JSON.parse(msg.content.toString()));
                await publishDirectMessage(
                    channel,
                    'jobber-update-gig',
                    'update-gig',
                    JSON.stringify({ type: 'updateGig', gigReview: msg.content.toString() }),
                    'message sent to gig service'
                )
            }


        })

    } catch (error) {
        log.log('error', 'UserService UserConsumer consumeReviewFanoutMessage() method error', error);
    }
}

async function consumeSeedGigDirectMessages(channel) {
    try {
        if (!channel) {
            channel = createConnection();
        }

        const exchangeName = 'jobber-gig';
        const routingKey = 'get-sellers'
        const queueName = 'user-gig-queue';

        await channel.assertExchange(exchangeName, 'direct');
        const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
        channel.consume(jobberQueue.queue, async (msg) => {
            const { type } = JSON.parse(msg.content.toString());

            if (type === 'getSellers') {
                const { count } = JSON.parse(msg.content.toString());
                const sellers = await getRandomSellers(parseInt(count));

                await publishDirectMessage(
                    channel,
                    'jobber-seed-gig',
                    'receive-sellers',
                    JSON.stringify({ type: 'receiveSellers', sellers, count }),
                    'message sent to gig service'
                )
            }
            channel.ack(msg);
        })

    } catch (error) {
        log.log('error', 'UserService UserConsumer consumeSeedGigDirectMessages() method error', error);
    }
}

export {
    consumeBuyerDirectMessage,
    consumeSellerDirectMessage,
    consumeReviewFanoutMessage,
    consumeSeedGigDirectMessages
}
