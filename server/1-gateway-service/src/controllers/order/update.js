import { StatusCodes } from 'http-status-codes';
import { orderService } from '../../services/api/order-service.js';

export class Update {
    async cancel(req, res) {
        const { orderId } = req.params;

        const { orderData, paymentIntentId } = req.body;

        const response = await orderService.cancelOrder(paymentIntentId, orderId, orderData);
        res.status(StatusCodes.CREATED).json({ message: response.data.message });
    }

    async requestExtension(req, res) {
        const { orderId } = req.params;
        const response = await orderService.requestDeliveryDateExtension(orderId, req.body);
        res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
    }

    async deliveryDate(req, res) {
        const { orderId, type } = req.params;
        const response = await orderService.updateDeliveryDate(orderId, type, req.body);
        res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
    }

    async deliverOrder(req, res) {
        const { orderId } = req.params;
        const response = await orderService.deliverOrder(orderId, req.body);
        res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
    }

    async approveOrder(req, res) {
        const { orderId } = req.params;
        const response = await orderService.approveOrder(orderId, req.body);
        res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
    }

    async markNotificationAsRead(req, res) {
        const { notificationId } = req.body;
        const response = await orderService.markNotificationAsRead(notificationId);
        res.status(StatusCodes.OK).json({ message: response.data.message, notification: response.data.notification });
    }
}