import express from 'express';
import{health} from '../controllers/health.js'
const router = express.Router();
const healthRoute = ()=>{

    router.get('/chat-health',health)

    
    return router;
}

export{healthRoute}