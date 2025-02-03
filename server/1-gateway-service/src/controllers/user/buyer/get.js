

import { StatusCodes } from "http-status-codes";
import { buyerService } from '../../../services/api/buyer-service.js';


export const email = async (req, res) => {
    const response = await buyerService.getBuyerByEmail();
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        buyer: response.data.buyer,
    });
};
export const currentUsername = async (req, res) => {
    const response = await buyerService.getCurrentBuyerByUsername();
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        buyer: response.data.buyer,
    });
};
export const username = async (req, res) => {
    const response = await buyerService.getBuyerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        buyer: response.data.buyer,
    });
};





