import { BadRequestError } from '@sachinsingh53/jobber-shared';
import{getBuyerByEmail,getBuyerByUsername} from '../../services/buyer-service.js'
import{StatusCodes} from 'http-status-codes'

const email = async(req,res)=>{
    const buyer = await getBuyerByEmail(req.currentUser.email);
    res.status(StatusCodes.OK).json({
        message: 'Buyer Profile',
        buyer
    })
}

const currentUsername = async(req,res)=>{
    const buyer = await getBuyerByUsername(req.currentUser.username);
    if(!buyer.length){
        throw new BadRequestError('Please SignIn','currentUsername()')
    }
    res.status(StatusCodes.OK).json({
        message: 'Buyer Profile',
        buyer
    })
}
const username = async(req,res)=>{
    const buyer = await getBuyerByUsername(req.params.username);
    if(!buyer.length){
        throw new BadRequestError('Invalid Username','username()')
    }
    res.status(StatusCodes.OK).json({
        message: 'Buyer Profile',
        buyer
    })
}

export{
    email,
    currentUsername,
    username
}