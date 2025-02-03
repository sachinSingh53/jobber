import {authService} from '../../services/api/auth-service.js'
import {StatusCodes} from 'http-status-codes'

export async function gigById(req,res){
    const response = await authService.getGig(req.params.gigId);

    res.status(StatusCodes.OK).json({
        message:response.data.message,
        gig: response.data.gig
    });
}


export async function gigs(req,res){
    const {from,size,type} = req.params;
    let query = '';

    //this will convert an object into key value pair array
    const objList = Object.entries(req.query);

    const lastIndex = objList.length-1;
    objList.forEach(([key,value],index)=>{
        query+= `${key}=${value}${index !== lastIndex ? '&' : ''}`
    });
    console.log(query);

    const response = await authService.getGigs(query,from,size,type);


    res.status(StatusCodes.OK).json({
        message:response.data.message,
        total: response.data.total,
        gigs: response.data.result
    });
}