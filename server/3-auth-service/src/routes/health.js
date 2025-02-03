import express from 'express';
import { health } from '../controllers/health.js';

const router = express.Router();
// router.get('/check')


router.get('/auth-health',health);

export default router;
