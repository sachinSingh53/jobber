import { StatusCodes } from "http-status-codes";
import{ gigService} from '../../services/api/gig-service.js'

export const updateGigs = async (req, res) => {
    const response = await gigService.updateGig(req.params.gigId,req.body);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        gig: response.data.gig,
    });
};

export const gigActive = async (req, res) => {
    const response = await gigService.updateActiveGigProp(req.params.gigId,req.body.isActive);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        gig: response.data.gig,
    });
};






