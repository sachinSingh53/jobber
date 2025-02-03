import express from 'express'
import { createSellerController } from '../controllers/seller/create.js';
import { updateSellerController } from '../controllers/seller/update.js';
import { id, random, username } from '../controllers/seller/get.js';
import { seed } from '../controllers/seller/seed.js';

const router = express.Router();

const sellerRoutes = ()=>{
    router.post('/seed/:count',seed);
    router.get('/id/:sellerId',id);
    router.get('/username/:username',username);
    router.get('/random/:count',random);
    router.post('/create',createSellerController);
    router.put('/:sellerId',updateSellerController);
    

    return router;
}

export{sellerRoutes}