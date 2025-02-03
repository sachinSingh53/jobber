import { StatusCodes } from 'http-status-codes';
import { messageService } from '../../services/api/message-service.js';
export class Create {
  async message(req, res) {
    const response = await messageService.addMessage(req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: response.data.message, conversationId: response.data.conversationId, messageData: response.data.messageData });
  }
}