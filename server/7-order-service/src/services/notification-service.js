import {OrderNotificationModel} from '../models/notification.js';
import{socketIoOrderObject} from '../app.js';
import { getOrderByOrderId } from './order-service.js';

const createNotification = async(data)=>{
    const notification = await OrderNotificationModel.create(data);
    return notification;
}

const getNotificationById = async(userToId)=>{
    const notifications = await OrderNotificationModel.aggregate([
        {
            $match:{userTo:userToId}
        }
    ]);

    return notifications;
}

const markNotificationAsRead = async(notificationId)=>{
    const notification = await OrderNotificationModel.findOneAndUpdate(
        {_id:notificationId},
        {
            $set:{
                isRead: true
            }
        },
        {new: true}
    )

    //we are doing it to update data on frontend

    const order = await getOrderByOrderId(notification.orderId);
    socketIoOrderObject.emit('order notification',order,notification);

    return notification;
};

const sendNotification = async(data,userToId,message)=>{
    const notification = {
        userTo: userToId,
        senderUsername:data.sellerUsername,
        receicerUsername:data.buyerUsername,
        message,
        orderId: data.orderId
    }

    const orderNotification = await createNotification(notification);
    socketIoOrderObject.emit('order notification',data,orderNotification);
}


export{
    createNotification,
    getNotificationById,
    markNotificationAsRead,
    sendNotification
}