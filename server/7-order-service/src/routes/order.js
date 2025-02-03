import express from 'express';
import { buyerOrders, orderId, sellerOrders } from '../controllers/order/get.js';
import { intent, order } from '../controllers/order/create.js';
import { buyerApproveOrder, cancel, deliverOrder, deliveryDate, requestExtension } from '../controllers/order/update.js';
import{notifications } from '../controllers/notification/get.js'
import{markNotification} from '../controllers/notification/update.js'
const router = express.Router();
const orderRoutes = ()=>{

    //order-routes
    router.get('/:orderId',orderId);
    router.get('/seller/:sellerId',sellerOrders);
    router.get('/buyer/:buyerId',buyerOrders);
    router.post('/',order);
    router.post('/create-payment-intent',intent);
    router.put('/cancel/:orderId',cancel);
    router.put('/extension/:orderId',requestExtension);
    router.put('/gig/:type/:orderId',deliveryDate);
    router.put('/deliver-order/:orderId',deliverOrder);
    router.put('/approve-order/:orderId',buyerApproveOrder);
    
    //notification-routes
    router.get('/notification/:userTo',notifications);
    router.put('/noitification/marked-as-read',markNotification);





    
    return router;
}


export{orderRoutes}
