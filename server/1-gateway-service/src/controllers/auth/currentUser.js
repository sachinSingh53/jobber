import { StatusCodes } from "http-status-codes";
import { authService } from "../../services/api/auth-service.js";
import{GatewayCache} from '../../redis/gateway.cache.js'
import{socketIO} from '../../app.js';
const gatewayCache = new GatewayCache();
//to find currentUser
export const read = async (req, res) => {
    const response = await authService.getCurrentUser();
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        user: response.data.user
    });
};

export const resendEmail = async(req,res) => {
    const response = await authService.resendEmail(req.body);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        user: response.data.user
    });
}

export const getLoggedInUsers  = async(req,res)=>{
    const response = await gatewayCache.getLoggedInUsersFromCache('loggedInUsers');
    socketIO.emit('online',response);
    res.status(StatusCodes.OK).json({message:'User is online'});
}
export const removeLoggedInUser  = async(req,res)=>{
    const response = await gatewayCache.removeLoggedInUserFromCache('loggedInUsers',res.params.username);
    socketIO.emit('online',response);
    res.status(StatusCodes.OK).json({message:'User is offline'});
}