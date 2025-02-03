
import {sellerSchema} from '../../schemes/seller.js'
import { createSeller, getSellerByEmail } from '../../services/seller-service.js';
import { BadRequestError } from '@sachinsingh53/jobber-shared';
import { StatusCodes } from 'http-status-codes';

const createSellerController = async(req,res)=>{
    const { error } = sellerSchema.validate(req.body);
    if (error) {
        throw new BadRequestError(error.details[0].message, ' Create seller() method error');
    }

    const checkIfSellerExist = await getSellerByEmail(req.body.email);

    if(checkIfSellerExist){
        throw new BadRequestError('seller already exist', ' Create seller() method error');
    }

    const sellerData = {
        profilePublicId: req.body.profilePublicId,
        fullName: req.body.fullName,
        username: req.currentUser.username,
        email: req.body.email,
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

    const createdSeller = await createSeller(sellerData);

    res.status(StatusCodes.CREATED).json({
        message:'Seller created successfully',
        seller: createdSeller
    })
}

export{
    createSellerController
}