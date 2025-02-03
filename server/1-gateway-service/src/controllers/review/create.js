
import { StatusCodes } from 'http-status-codes';

import { reviewService } from '../../services/api/review-service.js';

export class Create {
    async review(req, res) {
        const response = await reviewService.createReview(req.body);
        res.status(StatusCodes.CREATED).json({ message: response.data.message, order: response.data.order });
    }
}