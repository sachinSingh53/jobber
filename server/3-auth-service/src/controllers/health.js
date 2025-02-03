import { StatusCodes } from "http-status-codes";


export function health(req,res){
    res.status(StatusCodes.OK).send('Auth service is healthy and OK');
}