import { health } from '../controllers/health.js';
import express from 'express';

const router = express.Router();

const healthRoutes = () => {
  router.get('/review-health', health);

  return router;
};

export { healthRoutes };