import { StatusCodes } from "http-status-codes";
import{ gigService} from '../../services/api/gig-service.js'

export const seedGigs = async (req, res) => {
    const response = await gigService.seed(req.params.count);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
    });
};






