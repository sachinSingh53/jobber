
import {winstonLogger} from '@sachinsingh53/jobber-shared';
import{createClient} from 'redis'
import config from '../config.js';
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'GatewayRedisConnection','debug');

export class GatewayCache{
    constructor(){
        this.client = createClient({ url: `${config.REDIS_HOST}` });
    }
    
    async saveUserSelectedCategory(key,value){
        try{
            if(!this.client.isOpen){
                await this.client.connect();
            }
            await this.client.SET(key,value);
        }
        catch(error){
            log.log('error','GatewayService Cache saveUserSelectedCategory() method error: ',error);
        }
    }
    async saveLoggedInUserToCache(key,value){
        try{
            if(!this.client.isOpen){
                await this.client.connect();
            }
            const index = await this.client.LPOS(key,value);
            if(index===null){
                await this.client.LPUSH(key,value);
                log.info(`User ${value} added`)
            }

            const response = await this.client.LRANGE(key,0,-1);
            return response;
        }
        catch(error){
            log.log('error','GatewayService Cache saveLoggedInUserToCache() method error: ',error);
            return [];
        }
    }
    async getLoggedInUsersFromCache(key){
        try{
            if(!this.client.isOpen){
                await this.client.connect();
            }
            

            const response = await this.client.LRANGE(key,0,-1);
            return response;
        }
        catch(error){
            log.log('error','GatewayService Cache getLoggedInUsersFromCache() method error: ',error);
            return [];
        }
    }
    async removeLoggedInUserFromCache(key,value){
        try{
            if(!this.client.isOpen){
                await this.client.connect();
            }
            
            await this.client.LREM(key,1,value);
            log.info(`User ${value} removed`)

            const response = await this.client.LRANGE(key,0,-1);
            return response;
        }
        catch(error){
            log.log('error','GatewayService Cache getLoggedInUsersFromCache() method error: ',error);
            return [];
        }
    }
}
