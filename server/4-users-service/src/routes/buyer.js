import express from 'express'
import { currentUsername, email, username } from '../controllers/buyer/get.js';

const router = express.Router();

const buyerRoutes = ()=>{
    router.get('/email',email);
    router.get('/username',currentUsername);
    router.get('/:username',username);
    
    return router;
}

export{buyerRoutes}