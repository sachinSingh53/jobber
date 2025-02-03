
import { StatusCodes } from 'http-status-codes';

import { orderService } from '../../services/api/order-service.js';

export class Create {
    async intent(req, res) {

        const response = await orderService.createOrderIntent(req.body.price, req.body.buyerId);
        res
            .status(StatusCodes.CREATED)
            .json({ message: response.data.message, clientSecret: response.data.clientSecret, paymentIntentId: response.data.paymentIntentId });
    }

    async order(req, res) {
        
        const response = await orderService.createOrder(req.body);
        res.status(StatusCodes.CREATED).json({ message: response.data.message, order: response.data.order });
    }
}