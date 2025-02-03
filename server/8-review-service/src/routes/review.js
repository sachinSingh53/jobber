import { review } from '../controllers/create.js';
import { reviewsByGigId, reviewsBySellerId } from '../controllers/get.js';
import express from 'express';

const router = express.Router();

const reviewRoutes = () => {
  router.get('/gig/:gigId', reviewsByGigId);
  router.get('/seller/:sellerId', reviewsBySellerId);
  router.post('/', review);

  return router;
};

export { reviewRoutes };