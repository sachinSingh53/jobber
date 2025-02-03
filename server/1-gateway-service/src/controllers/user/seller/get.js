
import{StatusCodes} from 'http-status-codes'
import {sellerService} from '../../../services/api/seller-service.js'

export const id = async (req, res) => {
    const response = await sellerService.getSellerById(req.params.sellerId);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        seller: response.data.seller,
    });
};

export const username = async(req,res)=>{
    const response = await sellerService.getSellerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        seller: response.data.seller,
    });
}
export const random = async(req,res)=>{
    const response = await sellerService.getRandomSellers(req.params.count);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        sellers: response.data.sellers,
    });
}