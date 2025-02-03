import express from 'express';
import{ conversation, messages, userConversationList, userMessages } from '../controllers/get.js'
import { message } from '../controllers/create.js';
import{ markMultipleMessages, markSingleMessage, offer } from '../controllers/update.js'

const router = express.Router();
const messageRoutes = ()=>{

    router.get('/conversation/:senderUsername/:receiverUsername',conversation);
    router.get('/conversations/:username',userConversationList);
    router.get('/:senderUsername/:receiverUsername',messages);
    router.get('/:conversationId',userMessages);
    router.post('/',message);
    router.put('/offer',offer);
    router.put('/mark-as-read',markSingleMessage);
    router.put('/mark-multiple-as-read',markMultipleMessages);

    return router;
}

export{messageRoutes}