import { StatusCodes } from "http-status-codes";
import{ gigService} from '../../services/api/gig-service.js'

const gigById = async (req, res) => {
    const response = await gigService.getGigById(req.params.gigId);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        gig: response.data.gig,
    });
};

const sellerGigs = async (req, res) => {
    const response = await gigService.getSellerGigs(req.params.sellerId);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        gigs: response.data.gigs,
    });
};

const sellerPausedGigs = async (req, res) => {
    const response = await gigService.getSellerPausedGigs(req.params.sellerId);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        gigs: response.data.gigs,
    });
};


const gigsByCategory = async (req, res) => {
    const response = await gigService.getGigsByCategory(req.params.username);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        gigs: response.data.gigs,
    });
};

const moreGigsLikeThis = async (req, res) => {
    const response = await gigService.getMoreGigsLikeThis(req.params.gigId);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        gigs: response.data.gigs,
    });
};

const topRatedGigsByCategory = async (req, res) => {
    const response = await gigService.getTopRatedGigsByCategory(req.params.username);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        gigs: response.data.gigs,
    });
};

export{
    gigById,
    sellerGigs,
    sellerPausedGigs,
    gigsByCategory,
    moreGigsLikeThis,
    topRatedGigsByCategory
}
