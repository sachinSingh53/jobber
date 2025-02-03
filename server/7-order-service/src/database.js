
import mongoose from 'mongoose'
import { winstonLogger } from '@sachinsingh53/jobber-shared';
import config from './config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'OrderService Database Server','debug');

const databaseConnection = async ()=>{
    try {
        await mongoose.connect(`${config.DATABASE_URL}`);
        log.info('order-service is successfully connected to database');
    } catch (error) {
        log.log('error','OrderService databaseConnection() error',error);
    }
}

export {databaseConnection};