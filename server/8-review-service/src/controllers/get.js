import { getReviewsByGigId, getReviewsBySellerId } from '../services/review-service.js';
import { StatusCodes } from 'http-status-codes';

const reviewsByGigId = async (req, res) => {
  const reviews = await getReviewsByGigId(req.params.gigId);
  res.status(StatusCodes.OK).json({ message: 'Gig reviews by gig id', reviews });
};

const reviewsBySellerId = async (req, res) => {
  const reviews = await getReviewsBySellerId(req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Gig reviews by seller id', reviews });
};

export{
    reviewsByGigId,
    reviewsBySellerId
}