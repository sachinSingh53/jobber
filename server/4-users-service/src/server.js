import 'express-async-errors';
import config from './config.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import { createConnection } from './queues/connection.js';
import { winstonLogger } from '@sachinsingh53/jobber-shared';
import { CustomError } from '@sachinsingh53/jobber-shared';
import { consumeBuyerDirectMessage, consumeReviewFanoutMessage, consumeSeedGigDirectMessages, consumeSellerDirectMessage } from './queues/user-consumer.js';
import { appRoutes } from './routes.js';



const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'UsersServer', 'debug');

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
        const userChannel = await createConnection();
        await consumeBuyerDirectMessage(userChannel);
        await consumeSellerDirectMessage(userChannel);
        await consumeReviewFanoutMessage(userChannel);
        await consumeSeedGigDirectMessages(userChannel);
        return userChannel;
        
    } catch (error) {
        log.error('error in startQueues() in server.js ', error, '');
    }
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

function startServer(app) {
    try {
        const SERVER_PORT = 4003;
        app.listen(SERVER_PORT, () => {
            log.info(`Users server is listening on ${SERVER_PORT}`);
        });
    } catch (err) {
        log.log('error','error in startServer(): ', err);

    }
}

async function start(app) {
    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    const userChannel = await startQueues();
    // startElasticSearch();
    errorHandler(app);
    startServer(app);

    return userChannel;
}


export { start };
