import config from '../config.js';
import { client } from './redis.connection.js';
import{winstonLogger} from '@sachinsingh53/jobber-shared'

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'gigCache','debug');

const getUserSelectedGigCategory = async(key)=>{
    try {
        if(!client.isOpen){
            await client.connect();
        }

        const response = await client.GET(key);
        return response;

    } catch (error) {
        log.log('error','gigService gigCache getUserSelectedGigCategory() method error: ',error);
        return {};
    }
}

export{
    getUserSelectedGigCategory
}


