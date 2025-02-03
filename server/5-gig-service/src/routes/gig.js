import express from 'express';
import { gig as createGig } from '../controllers/create.js';
import { gigUpdate, gigUpdateActive } from '../controllers/update.js';
import { gigDelete } from '../controllers/delete.js';
import { getGig, gigsByCategory, moreLikeThis, sellerGigs, sellerInactiveGigs, topRatedGigsByCategory } from '../controllers/get.js';
import { gigs } from '../controllers/search.js';
import { gigSeed } from '../controllers/seed.js';

const router = express.Router();

const gigRoutes = ()=>{
    router.get('/:gigId',getGig);
    router.get('/seller/:sellerId',sellerGigs);
    router.get('/seller/pause/:sellerId',sellerInactiveGigs);
    router.get('/search/:from/:size/:type',gigs);
    router.get('/category/:username',gigsByCategory);
    router.get('/top/:username',topRatedGigsByCategory);
    router.get('/similar/:gigId',moreLikeThis);
    router.post('/create',createGig);
    router.put('/:gigId',gigUpdate);
    router.put('/active/:gigId',gigUpdateActive);
    router.put('/seed/:count',gigSeed);
    router.delete('/:gigId/:sellerId',gigDelete);
    return router;
}

export{gigRoutes}