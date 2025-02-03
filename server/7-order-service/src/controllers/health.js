import{StatusCodes} from 'http-status-codes';

const health = async(req,res)=>{
    res.status(StatusCodes.OK).send('order service is healthy and ok');
}

export{health};