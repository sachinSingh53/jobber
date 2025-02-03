import express from 'express';
import { StatusCodes } from "http-status-codes";
const router = express.Router();

router.get('/gig-health',(req,res)=>{
    res.status(StatusCodes.OK).send('Gig service is healthy and ok')
})

export default router;
