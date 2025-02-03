
import{StatusCodes} from 'http-status-codes'
import {sellerService} from '../../../services/api/seller-service.js'

export const seller = async (req, res) => {
    const response = await sellerService.createSeller(req.body);
    res.status(StatusCodes.CREATED).json({
        message: response.data.message,
        seller: response.data.seller,
    });
};