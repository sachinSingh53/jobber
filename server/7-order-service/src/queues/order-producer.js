import config from '../config.js';
import { winstonLogger } from '@sachinsingh53/jobber-shared'
import { createConnection } from './connection.js'

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'orderServiceProducer', 'debug');

async function publishDirectMessage(channel, exchangeName, routingKey, message, logMessage) {
    try {
        if (!channel) {
            channel = await createConnection();
        }
        await channel.assertExchange(exchangeName, 'direct');
        channel.publish(exchangeName, routingKey, Buffer.from(message));
        log.info(logMessage);
    } catch (error) {
        log.log('error','OrderService publishDirectMessage() method error',error);
    }
}

export {publishDirectMessage};