import express from 'express';
import{gigs, singleGigById} from '../controllers/search.js'

const router = express.Router();
// router.get('/check')


router.get('/search/gig/:from/:size/:type',gigs);
router.get('/search/gig/:gigId',singleGigById);

export default router;
