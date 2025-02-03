import{StatusCodes} from 'http-status-codes'
import{ getConversation, getMessages, getUserConversationList, getUserMessages } from '../services/messageService.js'

const conversation = async(req,res)=>{
    const {senderUsername, receiverUsername} = req.params;
    const conversation = await getConversation(senderUsername,receiverUsername);
    
    res.status(StatusCodes.OK).json({
        message: ' chat conversation',
        conversation
    })
}

const userConversationList = async(req,res)=>{
    const {username} = req.params;
    const messages = await getUserConversationList(username);
    res.status(StatusCodes.OK).json({
        message: 'Conversation List',
        conversations: messages
    })
}

const messages = async(req,res)=>{
    const {senderUsername, receiverUsername} = req.params;
    const messages = await getMessages(senderUsername,receiverUsername);
    res.status(StatusCodes.OK).json({
        message: 'chat messages',
        messages
    })
}

const userMessages = async(req,res)=>{
    const {conversationId} = req.params;

    const messages = await getUserMessages(conversationId);
    res.status(StatusCodes.OK).json({
        message: 'chat messages',
        messages
    })
}

export{
    userMessages,
    messages,
    userConversationList,
    conversation
}