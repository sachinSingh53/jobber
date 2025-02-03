import { GatewayServer } from './server.js';
import express from 'express';
import { redisConnection } from './redis/redis.connection.js';
import './apm.js';
class Application {
    async init() {
        const app = express();
        const server = new GatewayServer(app);
        const socketIO = await server.start();
        redisConnection.redisConnect();
        return socketIO;
    }
}



const application = new Application();
const socketIO = await application.init();

export{
    socketIO
}
