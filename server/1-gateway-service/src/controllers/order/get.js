import { orderService } from '../../services/api/order-service.js'
import { StatusCodes } from 'http-status-codes';

export class Get {
   async orderId(req, res) {

    const response = await orderService.getOrderById(req.params.orderId);
    res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
  }

   async sellerOrders(req, res) {
    const response = await orderService.sellerOrders(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, orders: response.data.orders });
  }

   async buyerOrders(req, res) {
    const response = await orderService.buyerOrders(req.params.buyerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, orders: response.data.orders });
  }

   async notifications(req, res) {
    const response = await orderService.getNotifications(req.params.userTo);
    res.status(StatusCodes.OK).json({ message: response.data.message, notifications: response.data.notifications });
  }
}