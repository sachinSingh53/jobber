import { publishDirectMessage } from '../queues/order-producer.js';
import { OrderModel } from '../models/order.js'
import { orderChannel } from '../app.js';
import { lowerCase } from '@sachinsingh53/jobber-shared';
import config from '../config.js';
import { sendNotification } from './notification-service.js';

const getOrderByOrderId = async (orderId) => {
    const order = await OrderModel.findOne({ orderId });
    return order;
}

const getOrdersBySellerId = async (sellerId) => {
    const orders = await OrderModel.aggregate([{ $match: { sellerId } }]);
    return orders;
}

const getOrdersByBuyerId = async (buyerId) => {
    const orders = await OrderModel.aggregate([{ $match: { buyerId } }]);
    return orders;
}

const createOrder = async (data) => {
    const order = await OrderModel.create(data);
    const messageDetails = {
        sellerId: data.sellerId,
        ongoingJobs: 1,
        type: 'create-order'
    }

    //update seller info
    publishDirectMessage(
        orderChannel,
        'jobber-seller-updates',
        'user-seller',
        JSON.stringify(messageDetails),
        'Details sent to users service'
    );

    const emailMessageDetails = {
        buyerEmail:data.buyerEmail,
        sellerEmail:data.sellerEmail,
        orderId: data.orderId,
        invoiceId: data.invoiceId,
        orderDue: `${data.offer.newDeliveryDate}`,
        amount: `${data.price}`,
        buyerUsername: lowerCase(data.buyerUsername),
        sellerUsername: lowerCase(data.sellerUsername),
        title: data.offer.gigTitle,
        description: data.offer.description,
        requirements: data.requirements,
        serviceFee: `${order.serviceFee}`,
        total: `${order.price + order.serviceFee}`,
        orderUrl: `${config.CLIENT_URL}/orders/${data.orderId}/activities`,
        template: 'orderPlaced'
    };

    publishDirectMessage(
        orderChannel,
        'jobber-order-notification',
        'order-email',
        JSON.stringify(emailMessageDetails),
        'order email sent to notification service'
    );

    sendNotification(order, data.sellerUsername, 'placed an order for your gig');
    return order;

}

const cancelOrder = async (orderId, data) => {
    const order = await OrderModel.findOneAndUpdate(
        { orderId },
        {
            $set: {
                cancelled: true,
                status: 'Cancelled',
                approvedAt: new Date()
            }
        },
        { new: true }
    );


    //update seller info
    publishDirectMessage(
        orderChannel,
        'jobber-seller-updates',
        'user-seller',
        JSON.stringify({ type: 'cancel-order', sellerId: data.sellerId }),
        'cancelled order details sent to users service.'
    );

    //update buyer info
    publishDirectMessage(
        orderChannel,
        'jobber-buyer-updates',
        'user-buyer',
        JSON.stringify({ type: 'cancel-order', buyerId: data.buyerId, purchasedGigs: data.purchasedGigs }),
        'cancelled order details sent to users service.'
    );

    sendNotification(order, order.sellerUsername, ' cancelled your order');
    return order;

}

const approveOrder = async (orderId, data) => {
    const order = await OrderModel.findOneAndUpdate(
        { orderId },
        {
            $set: {
                approved: true,
                status: 'Completed',
                approvedAt: new Date()
            }
        },
        { new: true }
    );

    const messageDetails = {
        sellerId: data.sellerId,
        buyerId: data.buyerId,
        ongoingJobs: data.ongoingJobs,
        completedJobs: data.completedJobs,
        totalEarnings: data.totalEarnings, // this is the price the seller earned for lastest order delivered
        recentDelivery: `${new Date()}`,
        type: 'aprove-order'
    }


    //update seller info
    publishDirectMessage(
        orderChannel,
        'jobber-seller-updates',
        'user-seller',
        JSON.stringify(messageDetails),
        'Approved order details sent to users service.'
    );

    //update buyer info
    publishDirectMessage(
        orderChannel,
        'jobber-buyer-updates',
        'user-buyer',
        JSON.stringify({ type: 'purchased-gig', buyerId: data.buyerId, purchasedGigs: data.purchasedGigs }),
        'cancelled order details sent to users service.'
    );

    sendNotification(order, order.sellerUsername, ' approved your order');
    return order;

}

const sellerDeliverOrder = async (orderId, delivered, deliveredWork) => {
    const order = await OrderModel.findOneAndUpdate(
        { orderId },
        {
            $set: {
                delivered,
                status: 'Delivered',
                ['events.orderDelivered']: new Date()
            },
            $push: {
                deliveredWork
            }
        },
        { new: true }
    );

    if (order) {

        const messageDetails = {
            orderId,
            buyerUsername: lowerCase(order.buyerUsername),
            sellerUsername: lowerCase(order.sellerUsername),
            receiverEmail: order.buyerEmail,
            title: order.offer.gigTitle,
            description: order.offer.description,
            orderUrl: `${config.CLIENT_URL}/orders/${orderId}/activities`,
            template: 'orderDelivered'
        }
        //send email
        publishDirectMessage(
            orderChannel,
            'jobber-order-notification',
            'order-email',
            JSON.stringify(messageDetails),
            'Order devivered notification sent to notification service'
        );

        sendNotification(order, order.buyerUsername, ' delivered your order');
    }

    return order;

}

const requestDeliveryExtension = async (orderId, data) => {

    const { newDate, days, reason, originalDate } = data;

    const order = await OrderModel.findOneAndUpdate(
        { orderId },
        {
            $set: {
                ['requestExtension.originalDate']: originalDate,
                ['requestExtension.newDate']: newDate,
                ['requestExtension.days']: days,
                ['requestExtension.reason']: reason,

            },
        },
        { new: true }
    );

    if (order) {
    
        const messageDetails = {
            buyerUsername: lowerCase(order.buyerUsername),
            sellerUsername: lowerCase(order.sellerUsername),
            originalDate: order.offer.oldDeliveryDate,
            newDate: order.offer.newDeliveryDate,
            reason: order.offer.reason,
            orderUrl: `${config.CLIENT_URL}/orders/${orderId}/activities`,
            receiverEmail: order.buyerEmail,
            template: 'orderExtension'
        }


        //send email
        publishDirectMessage(
            orderChannel,
            'jobber-order-notification',
            'order-email',
            JSON.stringify(messageDetails),
            'Order devivered notification sent to notification service'
        );

        sendNotification(order, order.buyerUsername, 'requested for an order delivery extension.');
    }

    return order;

}

const approveDeliveryDate = async (orderId, data) => {

    const { newDate, days, reason, deliveryDateUpdate } = data;

    const order = await OrderModel.findOneAndUpdate(
        { orderId },
        {
            $set: {
                ['offer.deliveryInDays']: days,
                ['offer.newDeliveryDate']: newDate,
                ['offer.reason']: reason,
                ['events.deliveryDateUpdate']: new Date(`${deliveryDateUpdate}`),
                requestExtension: {
                    originalDate: '',
                    newDate: '',
                    days: 0,
                    reason: ''
                }

            },
        },
        { new: true }
    );

    if (order) {

        const messageDetails = {
            buyerUsername: lowerCase(order.buyerUsername),
            sellerUsername: lowerCase(order.sellerUsername),
            receiverEmail: order.sellerEmail,
            originalDate: order.offer.oldDeliveryDate,
            newDate: order.offer.newDeliveryDate,
            reason: order.offer.reason,
            orderUrl: `${config.CLIENT_URL}/orders/${orderId}/activities`,
            template: 'orderExtensionApproval'
        };
        // send email
        await publishDirectMessage(
            orderChannel,
            'jobber-order-notification',
            'order-email',
            JSON.stringify(messageDetails),
            'Order delivered message sent to notification service.'
        );
        sendNotification(order, order.buyerUsername, 'requested for an order delivery date extension.');
    }

    return order;

}

const rejectDeliveryDate = async (orderId) => {

    const order = await OrderModel.findOneAndUpdate(
        { orderId },
        {
            $set: {
                requestExtension: {
                    originalDate: '',
                    newDate: '',
                    days: 0,
                    reason: ''
                }

            },
        },
        { new: true }
    );

    if (order) {

        const messageDetails = {
            subject: 'Sorry: Your extension request was rejected',
            buyerUsername: lowerCase(order.buyerUsername),
            sellerUsername: lowerCase(order.sellerUsername),
            header: 'Request Rejected',
            type: 'rejected',
            message: 'You can contact the buyer for more information.',
            orderUrl: `${config.CLIENT_URL}/orders/${orderId}/activities`,
            template: 'orderExtensionApproval'
        };
        // send email
        await publishDirectMessage(
            orderChannel,
            'jobber-order-notification',
            'order-email',
            JSON.stringify(messageDetails),
            'Order request extension rejection message sent to notification service.'
        );
        sendNotification(order, order.sellerUsername, 'rejected your order delivery date extension request.');
    }

    return order;

}


const updateOrderReview = async (data) => {

    const order = await OrderModel.findOneAndUpdate(
        { orderId: data.orderId },
        {
            $set: data.type === 'buyer-review' ?
                {
                    buyerReview: {
                        rating: data.rating,
                        review: data.review,
                        created: new Date(`${data.createdAt}`),
                        ['events.buyerReview']: new Date(`${data.createdAt}`)
                    }
                } :
                {
                    sellerReview: {
                        rating: data.rating,
                        review: data.review,
                        created: new Date(`${data.createdAt}`),
                        ['events.sellerReview']: new Date(`${data.createdAt}`)
                    }
                }
        },
        { new: true }
    );


    sendNotification(
        order,
        data.type==='buyer-review'? order.sellerUsername:order.buyerUsername,
        `left you a ${data.star} star review`
    );


    return order;

}


export {
    getOrderByOrderId,
    getOrdersBySellerId,
    getOrdersByBuyerId,
    createOrder,
    cancelOrder,
    approveOrder,
    sellerDeliverOrder,
    requestDeliveryExtension,
    approveDeliveryDate,
    rejectDeliveryDate,
    updateOrderReview
}