import { winstonLogger } from '@sachinsingh53/jobber-shared'
import { createConnection } from './connection.js'
import config from '../config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'userServiceProducer', 'debug');

async function publishDirectMessage(channel, exchangeName, routingKey, message, logMessage) {
    try {
        if (!channel) {
            channel = await createConnection();
        }
        await channel.assertExchange(exchangeName, 'direct');
        channel.publish(exchangeName, routingKey, Buffer.from(message));
        log.info(logMessage);
    } catch (error) {
        log.log('error','UserService publishDirectMessage() method error',error);
    }
}

export {publishDirectMessage};