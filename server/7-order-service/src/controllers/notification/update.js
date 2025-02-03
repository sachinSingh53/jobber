import{ getNotificationById, markNotificationAsRead } from '../../services/notification-service.js'
import{StatusCodes} from 'http-status-codes';

const markNotification = async(req,res)=>{
    const {notificationId} = req.body;
    const notification = await markNotificationAsRead(notificationId);
    res.status(StatusCodes.OK).json({
        message:'Notification is marked read',
        notification
    })
}

export{
    markNotification
}