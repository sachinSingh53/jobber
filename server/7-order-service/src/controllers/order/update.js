import Stripe from 'stripe';
import config from '../../config.js'
import{StatusCodes} from 'http-status-codes';
import { approveDeliveryDate, approveOrder, cancelOrder, rejectDeliveryDate, requestDeliveryExtension, sellerDeliverOrder } from '../../services/order-service.js';
import{orderUpdateSchema} from '../../schemes/order.js';
import crypto from 'crypto';
import { BadRequestError } from '@sachinsingh53/jobber-shared';
import{uploads} from '@sachinsingh53/jobber-shared'



const stripe = new Stripe(config.STRIPE_API_KEY);

const cancel = async(req,res)=>{
    
    // await stripe.refunds.create({
    //     payment_intent: `${req.body.payment_intent}`
    // })

    const {orderId} = req.params;

    await cancelOrder(orderId,req.body.orderData);
    res.status(StatusCodes.OK).json({ message: 'Order cancelled successfully.'});
}

const requestExtension = async(req,res)=>{
    const {error} = orderUpdateSchema.validate(req.body);
    if(error?.details){
        throw new BadRequestError(error.details[0].message, ' update requestExtension() method error');
    }

    const {orderId} = req.params;

    const order = await requestDeliveryExtension(orderId,req.body);
    res.status(StatusCodes.OK).json({
        message:'Order delivery request',
        order
    })
}

const deliveryDate = async(req,res)=>{
    const {error} = orderUpdateSchema.validate(req.body);
    if(error?.details){
        throw new BadRequestError(error.details[0].message, ' update deleveryDate() method error');
    }

    const {orderId,type} = req.params;

    const order = type === 'approve'? await approveDeliveryDate(orderId,req.body) : await rejectDeliveryDate(orderId);
    
    res.status(StatusCodes.OK).json({
        message:'Order delivery date extension',
        order
    })
}
const buyerApproveOrder = async(req,res)=>{
    const {orderId} = req.params;

    const order = await approveOrder(orderId,req.body);
    
    res.status(StatusCodes.OK).json({
        message:'Order approved successfully',
        order
    })
}

const deliverOrder = async(req,res)=>{
    const {orderId} = req.params;

    let file = req.body.file;
    const randomCharacters = crypto.randomBytes(20).toString('hex');

    if(file){
        const result = req.fileType === 'zip' ? await uploads(file,`${randomCharacters}.zip`): await uploads(file);
        if(!result.public_id){
            throw new BadRequestError('File upload error ','update deliverOrder() method'); 
        }
        file = result?.secure_url;
    }

    const deliverWork = {
        message:req.body.message,
        file,
        fileType:req.body.fileType,
        fileSize:req.body.fileSize,
        fileName:req.body.fileName,

    }

    const order = await sellerDeliverOrder(orderId,true,deliverWork);
    res.status(StatusCodes.OK).json({ message: 'Order delivered successfully.', order });
    
}
export {
    cancel,
    requestExtension,
    buyerApproveOrder,
    deliveryDate,
    deliverOrder
}