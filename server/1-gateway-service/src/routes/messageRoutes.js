import express from 'express';
import authMiddleware from '../services/auth-middleware.js';
import{Get} from '../controllers/message/get.js'
import{Create} from '../controllers/message/create.js'
import{ Update } from '../controllers/message/update.js'

const  router = express.Router();

router.get('/message/conversation/:senderUsername/:receiverUsername',authMiddleware.verifyUser, Get.prototype.conversation );
router.get('/message/conversations/:username',authMiddleware.verifyUser, Get.prototype.conversationList);
router.get('/message/:senderUsername/:receiverUsername',authMiddleware.verifyUser, Get.prototype.messages);
router.get('/message/:conversationId',authMiddleware.verifyUser, Get.prototype.userMessages);
router.post('/message/',authMiddleware.verifyUser, Create.prototype.message);
router.put('/message/offer',authMiddleware.verifyUser, Update.prototype.offer);
router.put('/message/mark-as-read',authMiddleware.verifyUser, Update.prototype.markSingleMessage);
router.put('/message/mark-multiple-as-read',authMiddleware.verifyUser, Update.prototype.markMultipleMessages);

export default router;
