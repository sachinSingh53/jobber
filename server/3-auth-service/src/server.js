import 'express-async-errors';
import config from './config.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import { createConnection } from './queues/connection.js';
import { winstonLogger } from '@sachinsingh53/jobber-shared';
import { CustomError } from '@sachinsingh53/jobber-shared';

import authRoutes from './routes/auth.js';
import currentUserRoutes from './routes/currentUserRoutes.js';
import healthroutes from './routes/health.js';
import searchRoutes from './routes/search.js';

import { checkConnection, createIndex } from './elasticsearch.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'authServer', 'debug');

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
    
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/auth', currentUserRoutes);
    app.use('',healthroutes);
    app.use('/api/v1/auth',searchRoutes);
}

async function startQueues() {
    try {
        const authChannel = await createConnection();
        return authChannel
    } catch (error) {
        log.error('error in startQueues() in server.js ', error, '');
    }

}

function startElasticSearch(){
    checkConnection();
    createIndex('gigs');
}

function startServer(app) {
    try {
        const SERVER_PORT = 4002;
        app.listen(SERVER_PORT, () => {
            log.info(`Auth server is listening on ${SERVER_PORT}`);
        });
    } catch (err) {
        log.error('error in startServer(): ', err, '');
        // throw new APIError(err);
    }
}

function errorHandler(app) {
    app.use((err, req, res, next) => {
        log.log('error', `AuthService ${err.comingFrom}`, err);
        if (err instanceof CustomError) {
            res.status(err.statusCode).json(err.serializeErrors());
        }
        next();
    });
}

async function start(app) {
    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    const authChannel = await startQueues();
    startElasticSearch();
    errorHandler(app);
    startServer(app);

    return authChannel;
}


export { start };
