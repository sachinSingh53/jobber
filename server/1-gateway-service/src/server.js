import http from 'http';
import cookieSession from 'cookie-session';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import config from './config.js';

import { axiosAuthInstance } from './services/api/auth-service.js';
import { winstonLogger } from '@sachinsingh53/jobber-shared';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '@sachinsingh53/jobber-shared';
import { axiosBuyerInstance } from './services/api/buyer-service.js';
import { axiosSellerInstance } from './services/api/seller-service.js';
import { axiosGigInstance } from './services/api/gig-service.js';
import { Server } from 'socket.io';
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import {socketIOAppHandler} from './sockets/socket.js'
import { axiosMessageInstance } from './services/api/message-service.js';

import authRoutes from './routes/auth.js';
import currentUserRoutes from './routes/currentUser.js';
import searchRoutes from './routes/search.js'
import buyerRoutes from './routes/buyer.js'
import sellerRoutes from './routes/seller.js'
import gigRoutes from './routes/gig.js'
import messageRoutes from './routes/messageRoutes.js'
import orderRoutes from './routes/order.js'
import reviewRoutes from './routes/review.js'
import healthRoute from './routes/health.js'
import { axiosOrderInstance } from './services/api/order-service.js';
import { axiosReviewInstance } from './services/api/review-service.js';


const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'Gateway Server', 'debug');
//  let socketIO;
class GatewayServer {
    #app;

    constructor(app) {
        this.#app = app;
    }

    start() {
        this.#securityMiddleware(this.#app);
        this.#standardMiddleware(this.#app);
        this.#routesMiddleware(this.#app);
        this.#errorHandler(this.#app);
        const socketIO = this.#startServer(this.#app);
        return socketIO;
    }

    #securityMiddleware(app) {
        app.set('trust-proxy', 1);
        app.use(
            cookieSession({
                name: 'session',
                keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
                maxAge: 24 * 60 * 60 * 10000,
                secure: config.NODE_ENV !== 'development'
            })
        );
        app.use(
            cors({
                origin: config.CLIENT_URL,
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            })
        );

        app.use((req, _res, next) => {
            if (req.session.jwt) {
                axiosAuthInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
                axiosBuyerInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
                axiosSellerInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
                axiosGigInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
                axiosMessageInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;
                axiosOrderInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;   
                axiosReviewInstance.defaults.headers['Authorization'] = `Bearer ${req.session.jwt}`;   
            }
            next();
        });
    }

    #standardMiddleware(app) {
        app.use(compression());
        app.use(bodyParser.json({ limit: '200mb' }));
        app.use(bodyParser.urlencoded({ extended: true, limit: '200mb' }));
        
          
    }

    #routesMiddleware(app) {
        app.use('/api/gateway/v1', authRoutes);
        app.use('/api/gateway/v1', currentUserRoutes)
        app.use('/api/gateway/v1', searchRoutes);
        app.use('/api/gateway/v1', buyerRoutes);
        app.use('/api/gateway/v1', sellerRoutes);
        app.use('/api/gateway/v1', gigRoutes);
        app.use('/api/gateway/v1', messageRoutes);
        app.use('/api/gateway/v1', orderRoutes);
        app.use('/api/gateway/v1', reviewRoutes);
        app.use('',healthRoute)
    }

    #errorHandler(app) {
        app.use('*', (req, res, next) => {
            log.error('endpoint does not exist', '');
            res.status(StatusCodes.NOT_FOUND).json({
                message: 'the endpoint you have called does not exists'
            });
            next();
        });

        app.use((err, req, res, next) => {
            log.error('Gateway Service Error', `${err.comingFrom}`, err);
            if (err instanceof CustomError) {
                res.status(err.statusCode).json(err.serializeErrors());
            }
            next();
        });
    }

    async #CreateSocketIO(httpServer) {
        const io = new Server(httpServer, {
            cors: {
                origin: `${config.CLIENT_URL}`,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            }
        }) 

        //The @socket.io/redis-adapter package allows broadcasting packets between multiple Socket.IO servers.
        const pubClient = createClient({ url: `${config.REDIS_HOST}` });
        const subClient = pubClient.duplicate();

        await Promise.all([
            pubClient.connect(),
            subClient.connect()
        ]);

        io.adapter(createAdapter(pubClient,subClient));
        return io;

    }

    async #startServer(app) {
        try {
            const httpServer = http.Server(app);
            this.#startHttpServer(httpServer);
            const socketIO = await this.#CreateSocketIO(httpServer);

            this.#socketIOConnections(socketIO);
            return socketIO;
        } catch (error) {
            log.log('error', 'GatewayService startServer() error method:', error);
        }
    }

    #startHttpServer(httpServer) {
        try {
            const SERVER_PORT = 4000;
            log.info(`Gateway server has started with processId: ${process.pid}`);
            httpServer.listen(SERVER_PORT, () => {
                log.info(`GatewayServer is running on port ${SERVER_PORT}`);
            })
        } catch (error) {
            log.log('error', 'GatewayService startServer() error method:', error)
        }
    }
    #socketIOConnections(io){
        const socketIoApp = new socketIOAppHandler(io);
        socketIoApp.listen();
    }
}

export { GatewayServer };
