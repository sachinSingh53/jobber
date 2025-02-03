import express from 'express';
import { StatusCodes } from "http-status-codes";
const router = express.Router();

router.get('/gateway-health',(req,res)=>{
    res.status(StatusCodes.OK).send('Gateway service is healthy and ok')
})

export default router;
