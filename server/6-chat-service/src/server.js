import http from 'http';
import 'express-async-errors';
import config from './config.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';

import { winstonLogger } from '@sachinsingh53/jobber-shared';
import { CustomError } from '@sachinsingh53/jobber-shared';
import { appRoutes } from './routes.js';
import { checkConnection } from './elasticsearch.js';
import { createConnection } from './queues/connection.js';
import { Server } from 'socket.io';


const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'ChatServer', 'debug');

function securityMiddleware(app) {
    app.set('trust proxy', 1);
    app.use(cors({
        origin: config.API_GATEWAY_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }));

    app.use((req, _res, next) => {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, config.JWT_TOKEN);
            req.currentUser = payload;
        }
        next();
    });
}

function standardMiddleware(app) {
    app.use(compression());
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
}

function routesMiddleware(app) {
    appRoutes(app);
}

async function startQueues() {
    try {
        const chatChannel = await createConnection();
        // await consumeGigDirectMessage(gigChannel);
        // await consumeSeedDirectMessage(gigChannel);
        return chatChannel;

    } catch (error) {
        log.error('error in startQueues() in server.js ', error, '');
    }

}

function startElasticSearch() {
    checkConnection();
}



function errorHandler(app) {
    app.use((err, req, res, next) => {
        log.log('error', `UsersService ${err.comingFrom}`, err);
        if (err instanceof CustomError) {
            res.status(err.statusCode).json(err.serializeErrors());
        }
        next();
    });
}



function createSocketIo(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }
    })

    return io;
}
function startHttpServer(httpServer) {
    try {
        const SERVER_PORT = 4005;
        httpServer.listen(SERVER_PORT, () => {
            log.info(`chat server is listening on ${SERVER_PORT}`);
        });
    } catch (err) {
        log.log('error', 'error in startHttpServer(): ', err);

    }
}

function startServer(app) {
    try {
        const httpServer = new http.Server(app);
        startHttpServer(httpServer);
        const socketIO =  createSocketIo(httpServer);
        return socketIO;

    } catch (err) {
        log.log('error', 'error in startServer(): ', err);

    }
}

async function start(app) {
    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    const chatChannel = await startQueues();
    startElasticSearch();
    errorHandler(app);
    const socketIoChatObject = startServer(app);

    return {chatChannel,socketIoChatObject};
}


export { start };
