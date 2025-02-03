import express from 'express';
import authMiddleware from '../services/auth-middleware.js';
import{Create} from '../controllers/review/create.js';
import{Get} from '../controllers/review/get.js';


const router = express.Router();

router.get('/review/gig/:gigId',authMiddleware.verifyUser, Get.prototype.getReviewsByGigId);
router.get('/review/seller/:sellerId',authMiddleware.verifyUser, Get.prototype.getReviewsBySellerId);
router.post('/review/',authMiddleware.verifyUser, Create.prototype.review);

export default router;
