import express from 'express';
import { create } from '../controllers/signup.js';
import {create as createSeed} from '../controllers/seed.js'
import { verifyGatewayRequest } from '@sachinsingh53/jobber-shared';

import { read } from '../controllers/signin.js';
import { update } from '../controllers/verifyEmail.js';
import{ForgotPassword,changePassword,resetPassword} from '../controllers/password.js'
import { health } from '../controllers/health.js';
const router = express.Router();
// router.get('/check')


router.post('/signup', verifyGatewayRequest, create);   
router.post('/signin', verifyGatewayRequest, read);   
router.put('/seed/:count', verifyGatewayRequest, createSeed);
router.put('/verify-email', verifyGatewayRequest, update);   
router.put('/forgot-password', verifyGatewayRequest, ForgotPassword);
router.put('/reset-password/:token', verifyGatewayRequest, resetPassword);
router.put('/change-password', verifyGatewayRequest, changePassword);
// router.post('/signup', create);   

export default router;
