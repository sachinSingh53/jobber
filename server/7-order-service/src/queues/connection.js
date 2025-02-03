import config from '../config.js';
import amqp from 'amqplib';
import { winstonLogger } from '@sachinsingh53/jobber-shared';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'orderQueueConnection', 'debug');

async function createConnection() {
    try {
        const connection = await amqp.connect(`${config.RABBITMQ_ENDPOINT}`);
        const channel = await connection.createChannel();
        log.info('orderServer connected to queues seccessfully');
        closeChannel(channel, connection);
        return channel;
        
    } catch (error) {
        log.log('error','orderService createConnection() error',error);
    }
}

function closeChannel(channel, connection) {
    process.once('SIGINT', async () => {
        await channel.close();
        await connection.close();
    })
}

export { createConnection };
