
import {sellerSchema} from '../../schemes/seller.js'
import { updateSeller } from '../../services/seller-service.js';
import { BadRequestError } from '@sachinsingh53/jobber-shared';
import { StatusCodes } from 'http-status-codes';

const updateSellerController = async(req,res)=>{
    const { error } = sellerSchema.validate(req.body);
    if (error) {
        throw new BadRequestError(error.details[0].message, ' Update seller() method error');
    }    
    const sellerData = {
        profilePublicId: req.body.profilePublicId,
        fullName: req.body.fullName,
        description: req.body.description,
        oneliner: req.body.oneliner,
        country: req.body.country,
        skills: req.body.skills,
        languages: req.body.languages,
        responseTime: req.body.responseTime,
        experience: req.body.experience,
        education: req.body.education,
        socialLinks: req.body.socialLinks,
        certificates: req.body.certificates
    };

    const updatedSeller = await updateSeller(req.params.sellerId,sellerData);

    res.status(StatusCodes.CREATED).json({
        message:'Seller created successfully',
        seller: updatedSeller
    })
}

export{
    updateSellerController
}