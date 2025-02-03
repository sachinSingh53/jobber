import { gigChannel } from "../app.js";
import { publishDirectMessage } from "../queues/gig-producer.js";
import{StatusCodes} from 'http-status-codes'


const gigSeed = async(req,res)=>{
    const {count} = req.params;
    await publishDirectMessage(
        gigChannel,
        'jobber-gig',
        'get-sellers',
        JSON.stringify({type:'getSellers',count})
    );
    res.status(StatusCodes.CREATED).json({
        message:'Gigs created successfully'
    })
}


export{gigSeed};