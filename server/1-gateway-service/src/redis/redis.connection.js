
import {winstonLogger} from '@sachinsingh53/jobber-shared';
import{createClient} from 'redis'
import config from '../config.js';
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'GatewayRedisConnection','debug');

class RedisConnection{
    constructor(){
        this.client = createClient({ url: `${config.REDIS_HOST}` });
    }

    async redisConnect(){
        try {
            await this.client.connect();
            log.info(`gatewayServiceRedisConnection: ${await this.client.ping()}`);
            this.cacheError();
        } catch (error) {
            log.log('error', 'gatewayService redisConnect() method: ', error);
        }
    
    }
    
    cacheError(){
        this.client.on('error', (error) => {
            console.log(error);
        })
    };
}

const redisConnection = new RedisConnection();

export{redisConnection};