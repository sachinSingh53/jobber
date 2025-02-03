import { StatusCodes } from "http-status-codes";
import{ gigService} from '../../services/api/gig-service.js'


export const createGig = async (req, res) => {
    const response = await gigService.createGig(req.body);
    res.status(StatusCodes.CREATED).json({
        message: response.data.message,
        gig: response.data.gig,
    });
};






