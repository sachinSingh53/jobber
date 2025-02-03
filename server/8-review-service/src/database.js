
import config from './config.js'
import pkg from 'pg';
const {Pool} = pkg
// import {winstonLogger} from '../../9-jobber-shared/src/logger.js';
import {winstonLogger} from '@sachinsingh53/jobber-shared';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'ReviewServer', 'debug');

const pool = new Pool({
    host:`${config.DATABASE_HOST}`,
    user: `${config.DATABASE_USER}`,
    password: `${config.DATABASE_PASSWORD}`,
    port: 5432,
    database: `${config.DATABASE_NAME}`
});

pool.on('error',(error)=>{
    log.log('error','pg client error',error);
    process.exit(-1);
})

const createTableText = `
  CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL UNIQUE,
    gigId text NOT NULL,
    reviewerId text NOT NULL,
    orderId text NOT NULL,
    sellerId text NOT NULL,
    review text NOT NULL,
    reviewerImage text NOT NULL,
    reviewerUsername text NOT NULL,
    country text NOT NULL,
    reviewType text NOT NULL,
    rating integer DEFAULT 0 NOT NULL,
    createdAt timestamp DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
  );

  CREATE INDEX IF NOT EXISTS gigId_idx ON public.reviews (gigId);

  CREATE INDEX IF NOT EXISTS sellerId_idx ON public.reviews (sellerId);
`;


const databaseConnection = async()=>{
    try {
        await pool.connect();
        log.info('Review Service successfully connected to postgreSQL database');
        await pool.query(createTableText);
    } catch (error) {
        log.error('reviewService - unable to connect to database',error);
        log.log('error','databaseConnection() method error',error);
    }
}

export{
    databaseConnection,
    pool
}
