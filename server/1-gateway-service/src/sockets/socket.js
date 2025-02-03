
import { GatewayCache } from '../redis/gateway.cache.js'
import { io } from 'socket.io-client';
import { winstonLogger } from '@sachinsingh53/jobber-shared'
import config from '../config.js';
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'gatewaySocket', 'debug');

let chatSocketClient;
let orderSocketClient;


export class socketIOAppHandler {
  constructor(io) {
    this.io = io;
    this.gatewayCache = new GatewayCache();
    this.#chatSocketServiceIOConnections();
    this.#orderSocketServiceIOConnections();
  }

  listen() {
    this.#chatSocketServiceIOConnections();
    this.#orderSocketServiceIOConnections();

    this.io.on('connection', async (socket) => {

      socket.on('getLoggedInUsers', async () => {
        const response = this.gatewayCache.getLoggedInUsersFromCache('loggedInUsers');
        this.io.emit('online', response);
      });
      socket.on('loggedInUsers', async (username) => {
        const response = this.gatewayCache.saveLoggedInUserToCache('loggedInUsers', username);
        this.io.emit('online', response);
      });
      socket.on('removeLoggedInUser', async (username) => {
        const response = this.gatewayCache.removeLoggedInUserFromCache('loggedInUsers', username);
        this.io.emit('online', response);
      });
      socket.on('category', async (category, username) => {
        this.gatewayCache.saveUserSelectedCategory(`selectedCategories${username}`, category);

      });
    })
  }

  #chatSocketServiceIOConnections() {

    // this is a connection for the communication between gateway and chat service
    //this will act as a client for the chat service
    chatSocketClient = io(`${config.MESSAGE_BASE_URL}`, {
      transports: ['websocket', 'polling'],
      secure: true
    });

    chatSocketClient.on('connect', () => {
      log.info('ChatService socket connected');
    });

    chatSocketClient.on('disconnect', (reason) => {
      log.log('error', 'ChatSocket disconnect reason:', reason);
      chatSocketClient.connect();
    });

    chatSocketClient.on('connect_error', (error) => {
      log.log('error', 'ChatService socket connection error:', error);
      chatSocketClient.connect();
    });


    // custom-events
    chatSocketClient.on('message recieved', (data) => {
      this.io.emit('message recieved', data);
    })
    chatSocketClient.on('message updated', (data) => {
      this.io.emit('message updated', data);
    })


  }
  #orderSocketServiceIOConnections() {

    // this is a connection for the communication between gateway and order service
    //this will act as a client for the order service
    orderSocketClient = io(`${config.ORDER_BASE_URL}`, {
      transports: ['websocket', 'polling'],
      secure: true
    });

    orderSocketClient.on('connect', () => {
      log.info('OrderService socket connected');
    });

    orderSocketClient.on('disconnect', (reason) => {
      log.log('error', 'OrderSocket disconnect reason:', reason);
      orderSocketClient.connect();
    });

    orderSocketClient.on('connect_error', (error) => {
      log.log('error', 'OrderService socket connection error:', error);
      orderSocketClient.connect();
    });


    //custom events
    orderSocketClient.on('order notification',(data,orderNotification)=>{
      this.io.emit('order notification',data,orderNotification);
  })

  }
}
