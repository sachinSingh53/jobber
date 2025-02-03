import{addReview} from '../services/review-service.js'
import{StatusCodes} from 'http-status-codes'

const review = async(req,res)=>{
    const review = await addReview(req.body);
    res.status(StatusCodes.CREATED).json({
        message:'review created successfully',
        review
    })
}

export{review}