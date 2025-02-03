
import { StatusCodes } from 'http-status-codes';
import { messageService } from '../../services/api/message-service.js';
export class Update {
  async offer(req, res) {
    const response = await messageService.updateOffer(req.body.messageId, req.body.type);
    res.status(StatusCodes.OK).json({ message: response.data.message, singleMessage: response.data.singleMessage });
  }

  async markMultipleMessages(req, res) {
    const { messageId, senderUsername, receiverUsername } = req.body;
    const response = await messageService.markMultipleMessagesAsRead(receiverUsername, senderUsername, messageId);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
  
  async markSingleMessage(req, res) {
    const response = await messageService.markMessageAsRead(req.body.messageId);
    res.status(StatusCodes.OK).json({ message: response.data.message, singleMessage: response.data.singleMessage });
  }
}