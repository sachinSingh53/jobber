import express from 'express';
import{ currentUsername, email, username } from '../controllers/user/buyer/get.js'
import authMiddleware from '../services/auth-middleware.js';
const router = express.Router();

router.get('/buyer/email',authMiddleware.verifyUser,authMiddleware.checkAuthentication,email)
router.get('/buyer/username',authMiddleware.verifyUser,authMiddleware.checkAuthentication,currentUsername);
router.get('/buyer/:username',authMiddleware.verifyUser,authMiddleware.verifyUser,username); 

export default router;
