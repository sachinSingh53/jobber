import { StatusCodes } from "http-status-codes";

const health = (req,res)=>{
    res.status(StatusCodes.OK).send('User service is healthy and ok')
}

export{health}