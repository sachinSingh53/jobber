import{ getNotificationById } from '../../services/notification-service.js'
import{StatusCodes} from 'http-status-codes';

const notifications = async(req,res)=>{
    const notifications = await getNotificationById(req.params.userTo);
    res.status(StatusCodes.OK).json({
        message:'Notifications',
        notifications
    })
}

export{
    notifications
}