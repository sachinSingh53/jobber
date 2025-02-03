
import { winstonLogger } from '@sachinsingh53/jobber-shared';
import { createClient } from 'redis';
import config from '../config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'redisConnection', 'debug');

const client = createClient({ url: `${config.REDIS_HOST}` });

const redisConnect = async () => {
    try {
        await client.connect();
        log.info(`gigServiceRedisConnection: ${await client.ping()}`);
        cacheError()
    } catch (error) {
        log.log('error', 'gigService redisConnect() method: ', error);
    }

}

const cacheError = () => {
    client.on('error', (error) => {
        console.log(error);
    })
};

export{
    redisConnect,
    client
}