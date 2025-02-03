import dotenv from 'dotenv';

dotenv.config();

class Config {
    constructor() {
        this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN;
        this.JWT_TOKEN = process.env.JWT_TOKEN;
        this.NODE_ENV = process.env.NODE_ENV;
        this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
        this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.AUTH_BASE_URL = process.env.AUTH_BASE_URL;
        this.USER_BASE_URL = process.env.USER_BASE_URL;
        this.GIG_BASE_URL = process.env.GIG_BASE_URL;
        this.MESSAGE_BASE_URL = process.env.MESSAGE_BASE_URL;
        this.ORDER_BASE_URL = process.env.ORDER_BASE_URL;
        this.REVIEW_BASE_URL = process.env.REVIEW_BASE_URL;
        this.REDIS_HOST = process.env.REDIS_HOST;
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL
    }
}

const config = new Config();

export default config;
