import express from 'express';
import authMiddleware from '../services/auth-middleware.js';
import{Create} from '../controllers/order/create.js';
import{Get} from '../controllers/order/get.js';
import{Update} from '../controllers/order/update.js';

const router = express.Router();

router.get('/order/notification/:userTo',authMiddleware.verifyUser, Get.prototype.notifications);
router.get('/order/:orderId',authMiddleware.verifyUser, Get.prototype.orderId);
router.get('/order/seller/:sellerId',authMiddleware.verifyUser, Get.prototype.sellerOrders);
router.get('/order/buyer/:buyerId',authMiddleware.verifyUser, Get.prototype.buyerOrders);
router.post('/order',authMiddleware.verifyUser, Create.prototype.order);
router.post('/order/create-payment-intent',authMiddleware.verifyUser, Create.prototype.intent);
router.put('/order/cancel/:orderId',authMiddleware.verifyUser, Update.prototype.cancel);
router.put('/order/extension/:orderId',authMiddleware.verifyUser, Update.prototype.requestExtension);
router.put('/order/deliver-order/:orderId',authMiddleware.verifyUser, Update.prototype.deliverOrder);
router.put('/order/approve-order/:orderId',authMiddleware.verifyUser, Update.prototype.approveOrder);
router.put('/order/gig/:type/:orderId',authMiddleware.verifyUser, Update.prototype.deliveryDate);
router.put('/order/notification/mark-as-read',authMiddleware.verifyUser, Update.prototype.markNotificationAsRead);



export default router;
