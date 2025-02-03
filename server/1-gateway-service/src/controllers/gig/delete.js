import { StatusCodes } from "http-status-codes";
import{ gigService} from '../../services/api/gig-service.js'


export const deleteGig = async (req, res) => {
    const response = await gigService.deleteGig(req.params.gigId,req.params.sellerId);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
       
    });
};

