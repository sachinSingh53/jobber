import express from 'express';
import { gigById, gigs } from '../controllers/auth/search.js';
const router = express.Router();

router.get('/auth/search/gig/:from/:size/:type',gigs);
router.get('/auth/search/gig/:gigId',gigById)

export default router;
