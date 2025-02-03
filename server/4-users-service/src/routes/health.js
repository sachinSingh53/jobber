import express from 'express'
import { health } from '../controllers/health.js';


const router = express.Router();

const healthRoutes = ()=>{
    router.get('/user-health',health)

    return router;
}

export{healthRoutes}