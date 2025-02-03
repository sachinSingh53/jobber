import { winstonLogger } from "@sachinsingh53/jobber-shared";
import { seedData, updateGigReview } from "../services/gig-service.js";
import { createConnection } from "./connection.js";
import config from "../config.js";
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'gigServiceConsumer','debug');

async function consumeGigDirectMessage(channel) {
    try {
        if (!channel) {
            channel = createConnection();
        }

        const exchangeName = 'jobber-update-gig';
        const routingKey = 'update-gig';
        const queueName = 'gig-update-queue';

        await channel.assertExchange(exchangeName, 'direct');
        const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
        channel.consume(jobberQueue.queue, async (msg) => {
            const { gigReview } = JSON.parse(msg.content.toString());
            await updateGigReview(JSON.parse(gigReview));
            channel.ack(msg);
        })
    } catch (error) {
        log.log('error', 'GigService UserConsumer consumeGigDirectMessage() method error', error);
    }
}
async function consumeSeedDirectMessage(channel) {
    try {
        if (!channel) {
            channel = createConnection();
        }

        const exchangeName = 'jobber-seed-gig';
        const queueName = 'seed-gig-queue';
        const routingKey = 'receive-sellers';

        await channel.assertExchange(exchangeName, 'direct');
        const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
        await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
        channel.consume(jobberQueue.queue, async (msg) => {
            
            const {sellers,count} = JSON.parse(msg.content.toString());

            seedData(sellers,count);
            channel.ack(msg);
        })
    } catch (error) {
        log.log('error', 'GigService UserConsumer consumeGigDirectMessage() method error', error);
    }
}

export{
    consumeGigDirectMessage,
    consumeSeedDirectMessage
}