import express from 'express';
import { getLoggedInUsers, read, removeLoggedInUser, resendEmail } from '../controllers/auth/currentUser.js';
import authMiddleware from '../services/auth-middleware.js';
import { token } from '../controllers/auth/reftesh-token.js';
const router = express.Router();

router.get('/auth/currentuser',authMiddleware.verifyUser,authMiddleware.checkAuthentication, read);
router.get('/auth/logged-in-user',authMiddleware.verifyUser,authMiddleware.checkAuthentication, getLoggedInUsers);
router.delete('/auth/logged-in-user/:username',authMiddleware.verifyUser,authMiddleware.checkAuthentication, removeLoggedInUser);
router.post('/auth/resend-email',authMiddleware.verifyUser,authMiddleware.checkAuthentication, resendEmail );
router.get('/auth/refresh-token/:username',authMiddleware.verifyUser,authMiddleware.checkAuthentication, token );

export default router;
