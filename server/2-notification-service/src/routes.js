import express from 'express';

const router = express.Router();

router.get('/notification-health', (req, res) => {
    res.status(200).send('Notification service is running...');
});

export default router;
