import { reviewService } from '../../services/api/review-service.js'
import { StatusCodes } from 'http-status-codes';

export class Get {
    async getReviewsByGigId(req, res) {
        const response = await reviewService.getReviewByGigId(req.params.gigId);
        res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
    }
    async getReviewsBySellerId(req, res) {
        const response = await reviewService.getReviewBySellerId(req.params.sellerId);
        res.status(StatusCodes.OK).json({ message: response.data.message, order: response.data.order });
    }
   


}