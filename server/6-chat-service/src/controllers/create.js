import{messageSchema} from '../schemes/message.js'
import{uploads} from '@sachinsingh53/jobber-shared'
import{BadRequestError} from '@sachinsingh53/jobber-shared'
import{addMessage, createConversation} from '../services/messageService.js'
import crypto from 'crypto'
import{StatusCodes} from 'http-status-codes'
const message = async(req,res)=>{
    const { error } = messageSchema.validate(req.body);
    if (error?.details) {
        throw new BadRequestError(error.details[0].message, ' Create message() method ');
    }

    let file = req.body.file;
    const randomCharacters = crypto.randomBytes(20).toString('hex');

    if(file){
        const result = req.fileType === 'zip' ? await uploads(file,`${randomCharacters}.zip`): uploads(file);
        if(!result.public_id){
            throw new BadRequestError('File upload error ','create message() method'); 
        }
        file = result?.secure_url;
    }

    const messageData = {
        conversationId: req.body.conversationId,
        body: req.body.body,
        file,
        fileType: req.body.fileType,
        fileSize: req.body.fileSize,
        fileName: req.body.fileName,
        gigId: req.body.gigId,
        buyerId: req.body.buyerId,
        sellerId: req.body.sellerId,
        senderUsername: req.body.senderUsername,
        receiverUsername: req.body.receiverUsername,
        isRead: req.body.isRead,
        hasOffer: req.body.hasOffer,
        offer: req.body.offer
    };


    if(!req.body.hasConversationId){
        await createConversation(messageData.conversationId,messageData.senderUsername,messageData.receiverUsername);
    }

    await addMessage(messageData);

    res.status(StatusCodes.OK).json({
        message:'message added',
        conversationId: messageData.conversationId,
        messageData
    })

}

export{
    message
}