import{StatusCodes} from 'http-status-codes'
import{ markManyMessagesAsRead, markMessageAsRead, updateOffer } from '../services/messageService.js'

const offer = async(req,res)=>{
    const {messageId,type} = req.body;

    const message = await updateOffer(messageId,type);
    
    res.status(StatusCodes.OK).json({
        message: 'message updated',
        singleMessage: message
    })
}

const markMultipleMessages = async(req,res)=>{
    const {messageId,senderUsername,receiverUsername} = req.body;

    await markManyMessagesAsRead(senderUsername,receiverUsername,messageId);
    res.status(StatusCodes.OK).json({
        message: 'messages marked as read',
        // singleMessage: message
    })
}

const markSingleMessage = async(req,res)=>{
    const {messageId} = req.body;
    
    const message = await markMessageAsRead(messageId);
    res.status(StatusCodes.OK).json({
        message: 'message marked as read',
        singleMessage: message
    })
}


export{
    offer,
    markMultipleMessages,
    markSingleMessage
}