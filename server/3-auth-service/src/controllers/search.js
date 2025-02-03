import { getDoccumentById, gigsSearch } from "../elasticsearch.js";
import lodash from 'lodash';
import {StatusCodes} from 'http-status-codes'


export async function gigs(req,res){
    const {from,size,type} = req.params;
    let resultHits = [];
    const paginate = {from, size:parseInt(`${size}`), type};
    const gigs = await gigsSearch(
        `${req.query.query}`,
        paginate,
        `${req.query.delivery_time}`,
        parseInt(`${req.query.minPrice}`),
        parseInt(`${req.query.maxPrice}`)
    );

    for(const item of gigs.hits){
        resultHits.push(item._source);
    }

    if(type==='Backward'){
        resultHits = lodash.sortBy(resultHits,['sortId'])
    }
    

    res.status(StatusCodes.OK).json({
        message: 'Search gig result',
        total: gigs.total,
        result: resultHits
    });

}

export async function singleGigById(req,res){

    const gig = await getDoccumentById('gigs',req.params.gigId);
    res.status(StatusCodes.OK).json({
        message: 'Single gig result',
        gig
    })
}