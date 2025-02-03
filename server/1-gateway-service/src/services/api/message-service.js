import { AxiosService } from '../axios.js'
import config from '../../config.js'


export let axiosMessageInstance;

class MessageService {
  constructor() {
    const axiosService = new AxiosService(`${config.MESSAGE_BASE_URL}/api/v1/message`, 'message');
    axiosMessageInstance = axiosService.axios;
  }

  async getConversation(senderUsername, receiverUsername){
    const response = await axiosMessageInstance.get(`/conversation/${senderUsername}/${receiverUsername}`);
    return response;
  }

  async getMessages(senderUsername, receiverUsername){
    const response = await axiosMessageInstance.get(`/${senderUsername}/${receiverUsername}`);
    return response;
  }

  async getConversationList(username) {
    const response = await axiosMessageInstance.get(`/conversations/${username}`);
    return response;
  }

  async getUserMessages(conversationId){
    const response = await axiosMessageInstance.get(`/${conversationId}`);
    return response;
  }

  async addMessage(body) {
    const response = await axiosMessageInstance.post('/', body);
    return response;
  }

  async updateOffer(messageId, type) {
    const response = await axiosMessageInstance.put('/offer', { messageId, type });
    return response;
  }

  async markMessageAsRead(messageId) {
    const response = await axiosMessageInstance.put('/mark-as-read', { messageId });
    return response;
  }

  async markMultipleMessagesAsRead(receiverUsername, senderUsername, messageId) {
    const response = await axiosMessageInstance.put('/mark-multiple-as-read', {
      receiverUsername,
      senderUsername,
      messageId
    });
    return response;
  }
}

export const messageService = new MessageService();