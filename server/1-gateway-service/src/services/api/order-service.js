
import { AxiosService } from '../axios.js';
import config from '../../config.js';

let axiosOrderInstance;

class OrderService {
    constructor() {
        this.axiosService = new AxiosService(`${config.ORDER_BASE_URL}/api/v1/order`, 'order');
        axiosOrderInstance = this.axiosService.axios;
    }

    async getOrderById(orderId) {
        const response = await axiosOrderInstance.get(`/${orderId}`);
        return response;
    }
    async sellerOrders(sellerId) {
        const response = await axiosOrderInstance.get(`/seller/${sellerId}`);
        return response;
    }
    async buyerOrders(buyerId) {
        const response = await axiosOrderInstance.get(`/buyer/${buyerId}`);
        return response;
    }
    async createOrderIntent(price, buyerId) {
        const response = await axiosOrderInstance.post('/create-payment-intent', { price, buyerId });
        return response;
    }
    async createOrder(body) {
        const response = await axiosOrderInstance.post('/', body );
        return response;
    }
    async cancelOrder(paymentIntentId, orderId, body) {

        const response = await axiosOrderInstance.put(`/cancel/${orderId}`, { paymentIntentId, orderData: body });
        return response;
    }
    async requestDeliveryDateExtension( orderId, body) {
        const response = await axiosOrderInstance.put(`/extension/${orderId}`, body);
        return response;
    }
    async updateDeliveryDate( orderId,type, body) {
        const response = await axiosOrderInstance.put(`/gig/${type}/${orderId}`, body);
        return response;
    }
    //flag
    async deliverOrder( orderId, body) {
        const response = await axiosOrderInstance.put(`/deliver-order/${orderId}`, body);
        return response;
    }
    async approveOrder( orderId, body) {
        const response = await axiosOrderInstance.put(`/approve-order/${orderId}`, body);
        return response;
    }
    async getNotifications( userTo) {
        const response = await axiosOrderInstance.put(`/notification/${userTo}`);
        return response;
    }
    async markNotificationAsRead( notificationId) {
        const response = await axiosOrderInstance.put(`/notification/mark-as-read`,{notificationId});
        return response;
    }


    

}

const orderService = new OrderService();

export { axiosOrderInstance, orderService };