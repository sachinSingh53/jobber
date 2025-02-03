import dotenv from 'dotenv';

dotenv.config();

class Config {
    constructor() {
        this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
        this.JWT_TOKEN = process.env.JWT_TOKEN || '';
        this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
        this.DATABASE_URL = process.env.DATABASE_URL || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL|| '';
        this.REDIS_HOST = process.env.REDIS_HOST|| '';
    }
}

const config = new Config();

export default config;
