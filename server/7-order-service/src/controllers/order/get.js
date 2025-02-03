import { StatusCodes } from "http-status-codes";
import { getOrderByOrderId, getOrdersByBuyerId, getOrdersBySellerId } from "../../services/order-service.js"


const orderId = async(req,res)=>{
    const order = await getOrderByOrderId(req.params.orderId);
    res.status(StatusCodes.OK).json({
        message:'Order by orderId',
        order
    })
}
const sellerOrders = async(req,res)=>{
    const orders = await getOrdersBySellerId(req.params.sellerId);
    res.status(StatusCodes.OK).json({
        message:'Seller orders',
        orders
    })
}
const buyerOrders = async(req,res)=>{
    const orders = await getOrdersByBuyerId(req.params.buyerId);
    res.status(StatusCodes.OK).json({
        message:'buyer orders',
        orders
    })
}

export{
    orderId,
    sellerOrders,
    buyerOrders
}