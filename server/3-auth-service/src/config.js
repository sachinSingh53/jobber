import dotenv from 'dotenv';

dotenv.config();

class Config {
    constructor() {
        this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
        this.JWT_TOKEN = process.env.JWT_TOKEN || '';
        this.API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
        this.MYSQL_DB = process.env.MYSQL_DB || '';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL|| '';
    }
}

const config = new Config();

export default config;
