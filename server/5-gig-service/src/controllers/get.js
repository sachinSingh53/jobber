import { StatusCodes } from 'http-status-codes'
import { getGigById, getSellerGigs, getSellerInactiveGigs } from '../services/gig-service.js';
import { getUserSelectedGigCategory } from '../redis/gig.cache.js';
import { getMoreGigsLikeThis, getTopRatedGigsByCategory, gigSearchByCategory } from '../services/search-service.js';
const getGig = async (req, res) => {
    const gig = await getGigById(req.params.gigId);
    res.status(StatusCodes.OK).json({
        message: 'get gig by id',
        gig
    })
}

const sellerGigs = async (req, res) => {
    const gigs = await getSellerGigs(req.params.sellerId);

    res.status(StatusCodes.OK).json({
        message: 'seller gigs',
        gigs
    })
}

const sellerInactiveGigs = async (req, res) => {
    const gigs = await getSellerInactiveGigs(req.params.sellerId);
    
    res.status(StatusCodes.OK).json({
        message: 'seller gigs',
        gigs
    })
}

const topRatedGigsByCategory = async (req, res) => {
    const category = await getUserSelectedGigCategory(`selectedCategories:${req.params.username}`);
    let resultHits = [];
    const gigs = await getTopRatedGigsByCategory(`${category}`);
    for (const item of gigs.hits) {
        resultHits.push(item._source);
    }
    res.status(StatusCodes.OK).json({ message: 'Search top gigs results', total: gigs.total, gigs: resultHits });

}

const gigsByCategory = async (req, res) => {
    const category = await getUserSelectedGigCategory(`selectedCategories:${req.params.username}`);

    let resultHits = [];
    const gigs = await gigSearchByCategory(`${category}`);
    for (const item of gigs.hits) {
        resultHits.push(item._source);
    }
    res.status(StatusCodes.OK).json({ message: 'Search gigs category results', total: gigs.total, gigs: resultHits });
};



const moreLikeThis = async(req,res)=>{
    let resultHits = [];
    const gigs = await getMoreGigsLikeThis(`${req.params.gigId}`);
    for (const item of gigs.hits) {
        resultHits.push(item._source);
    }
    res.status(StatusCodes.OK).json({ message: 'More gigs like this result', total: gigs.total, gigs: resultHits });
}


export {
    getGig,
    sellerGigs,
    sellerInactiveGigs,
    topRatedGigsByCategory,
    gigsByCategory,
    moreLikeThis
};