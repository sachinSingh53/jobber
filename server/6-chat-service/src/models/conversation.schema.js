
import mongoose,{Schema} from 'mongoose';

const conversationSchema = new Schema({
    conversationId:{ type:String, required: true, unique:true, index:true },
    senderUsername:{ type:String, required: true, unique:true, index:true },
    receiverUsername:{ type:String, required: true, unique:true, index:true },
});

const ConversationModel = mongoose.model('Conversation',conversationSchema);

export { ConversationModel }