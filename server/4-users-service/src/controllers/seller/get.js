import { getRandomSellers, getSellerById, getSellerByUsername } from "../../services/seller-service.js"
import{StatusCodes} from 'http-status-codes'

const id = async(req,res)=>{
    const seller = await getSellerById(req.params.sellerId);
    res.status(StatusCodes.OK).json({
        message:'Seller profile',
        seller
    })
}

const username = async(req,res)=>{

    const seller = await getSellerByUsername(req.params.username);

    res.status(StatusCodes.OK).json({
        message:'Seller profile',
        seller
    })
}
const random = async(req,res)=>{
    const sellers = await getRandomSellers(parseInt(req.params.count));
    res.status(StatusCodes.OK).json({
        message:'Seller profile',
        sellers
    })
}

export{
    id,
    username,
    random
}