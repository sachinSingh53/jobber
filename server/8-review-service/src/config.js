import dotenv from 'dotenv';

dotenv.config();

class Config {
    constructor() {
        this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
        this.JWT_TOKEN = process.env.JWT_TOKEN || '';
        this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
        this.DATABASE_HOST = process.env.DATABASE_HOST || '';
        this.DATABASE_USER = process.env.DATABASE_USER || '';
        this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
        this.DATABASE_NAME = process.env.DATABASE_NAME || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';

    }

}

const config = new Config();

export default config;
