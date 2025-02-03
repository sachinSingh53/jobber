import express from 'express';
import authMiddleware from '../services/auth-middleware.js';
import{createGig} from '../controllers/gig/create.js'
import{deleteGig} from '../controllers/gig/delete.js'
import{searchGigs} from '../controllers/gig/search.js'
import{seedGigs} from '../controllers/gig/seed.js'
import{gigById,gigsByCategory,moreGigsLikeThis,sellerGigs,topRatedGigsByCategory,sellerPausedGigs} from '../controllers/gig/get.js'
import{updateGigs,gigActive} from '../controllers/gig/update.js'

const router = express.Router();

router.get('/gig/:gigId',authMiddleware.verifyUser,authMiddleware.checkAuthentication, gigById);
router.get('/gig/seller/:sellerId',authMiddleware.verifyUser,authMiddleware.checkAuthentication, sellerGigs);
router.get('/gig/seller/pause/:sellerId',authMiddleware.verifyUser,authMiddleware.checkAuthentication, sellerPausedGigs);
router.get('/gig/search/:from/:size/:type',authMiddleware.verifyUser,authMiddleware.checkAuthentication, searchGigs);
router.get('/gig/category/:username',authMiddleware.verifyUser,authMiddleware.checkAuthentication, gigsByCategory);
router.get('/gig/top/:username',authMiddleware.verifyUser,authMiddleware.checkAuthentication, topRatedGigsByCategory);
router.get('/gig/similar/:gigId',authMiddleware.verifyUser,authMiddleware.checkAuthentication, moreGigsLikeThis);
router.post('/gig/create',authMiddleware.verifyUser,authMiddleware.checkAuthentication, createGig);
router.put('/gig/:gigId',authMiddleware.verifyUser,authMiddleware.checkAuthentication, updateGigs);
router.put('/gig/active/:gigId',authMiddleware.verifyUser,authMiddleware.checkAuthentication, gigActive);
router.put('/gig/seed/:count',authMiddleware.verifyUser,authMiddleware.checkAuthentication, seedGigs);
router.delete('/gig/:gigId/:sellerId',authMiddleware.verifyUser,authMiddleware.checkAuthentication, deleteGig);

export default router;
