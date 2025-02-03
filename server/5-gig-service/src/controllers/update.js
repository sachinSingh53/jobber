import { gigUpdateSchema } from '../schemes/gig.js'
import { uploads } from '@sachinsingh53/jobber-shared'
import { isDataURL } from '@sachinsingh53/jobber-shared'
import { BadRequestError } from '@sachinsingh53/jobber-shared'
import{ updateActiveGigProp, updateGig} from '../services/gig-service.js'
import {StatusCodes} from 'http-status-codes'
const gigUpdate = async (req, res) => {
    const { error } = gigUpdateSchema.validate(req.body);
    if (error) {
        throw new BadRequestError(error.details[0].message, ' Create seller() method error');
    }
    //this isDataUrl function check whether the coverImage comming from the req.body is modified or it is the normal url;
    const isDataUrl = isDataUrl(req.body.coverImage);
    let coverImage = '';
    if(isDataURL){
        const result = uploads(req.body.coverImage);
        if(!result.public_id){
            throw new BadRequestError('File upload error, Try Again','gigUpdate() method error');
        }
        coverImage = result?.secure_url;
    }else{
        coverImage = req.body.coverImage;
    }

    
    const gig = {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        subCategories: req.body.subCategories,
        tags: req.body.tags,
        price: req.body.price,
        expectedDelivery: req.body.expectedDelivery,
        basicTitle: req.body.basicTitle,
        basicDescription: req.body.basicDescription,
        coverImage
    }

    const updatedGig = await updateGig(req.params.gigId,gig);

    res.status(StatusCodes.OK).json({
        message:'gig Created',
        gig: updatedGig
    })
}

const gigUpdateActive = async(req,res)=>{
    const updatedgig = await updateActiveGigProp(req.params.gigId,req.body.isActive);
    res.status(StatusCodes.OK).json({
        message:'gig updated successfully',
        gig:updatedgig
    })
}
export{gigUpdate,gigUpdateActive};