import { StatusCodes } from "http-status-codes";
import{ gigService} from '../../services/api/gig-service.js'

export const searchGigs = async (req, res) => {
    const {from,size,type} = req.params;
    let query = '';
    //this will convert an object into key value pair array
    const objList = Object.entries(req.query);
    const lastIndex = objList.length-1;
    objList.forEach(([key,value],index)=>{
        query+= `${key}=${value}${index !== lastIndex ? '&' : ''}`
    });
    const response = await gigService.searchGigs(query,from,size,type);
    res.status(StatusCodes.OK).json({
        message:response.data.message,
        total: response.data.total,
        gigs: response.data.result
    });
};

