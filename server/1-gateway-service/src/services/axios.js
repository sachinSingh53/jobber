import axios from 'axios';
import jwt from 'jsonwebtoken';
import config from '../config.js';

class AxiosService {
    constructor(baseUrl, serviceName) {
        this.axios = this.axiosCreateInstance(baseUrl, serviceName);
    }

    axiosCreateInstance(baseUrl, serviceName) {
        let requestGatewayToken = '';

        if (serviceName) {
            requestGatewayToken = jwt.sign({ id: serviceName }, `${config.GATEWAY_JWT_TOKEN}`);
        }
        const instance = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'gatewaytoken': requestGatewayToken
            },
            withCredentials: true
        });

        return instance;
    }
}

export { AxiosService };
