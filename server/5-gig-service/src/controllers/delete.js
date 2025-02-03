import{ deleteGig} from '../services/gig-service.js'
import {StatusCodes} from 'http-status-codes'
const gigDelete = async (req, res) => {
    await deleteGig(req.params.gigId,req.params.sellerId);
    res.status(StatusCodes.OK).json({
        message:'gig deleted successfully',
    })
}


export{gigDelete};