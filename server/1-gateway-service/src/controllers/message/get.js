import { StatusCodes } from 'http-status-codes';
import { messageService } from '../../services/api/message-service.js';
export class Get {
    async conversation(req, res) {
        const response = await messageService.getConversation(req.params.senderUsername, req.params.receiverUsername);
        res.status(StatusCodes.OK).json({ message: response.data.message, conversations: response.data.conversation });
    }

    async messages(req, res) {
        const response = await messageService.getMessages(req.params.senderUsername, req.params.receiverUsername);

        res.status(StatusCodes.OK).json({ message: response.data.message, messages: response.data.messages });
    }

    async conversationList(req, res) {
        const { username } = req.params;
        const response = await messageService.getConversationList(username);
        res.status(StatusCodes.OK).json({ message: response.data.message, conversations: response.data.conversations });
    }

    async userMessages(req, res) {
        const { conversationId } = req.params;

        const response = await messageService.getUserMessages(conversationId);
        res.status(StatusCodes.OK).json({ message: response.data.message, messages: response.data.messages });
    }
}