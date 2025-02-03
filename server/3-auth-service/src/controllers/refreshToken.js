
import { StatusCodes } from 'http-status-codes';
import{getUserByUsername, signToken} from '../services/auth-service.js'

export async function token(req,res){
    const existingUser = await getUserByUsername(req.params.username);

    // we are deleting the password form the exixting user form because we dont want to send the data to the frontend which contains password
    delete existingUser.dataValues.password;

    const userJwt = signToken(existingUser.dataValues.id,existingUser.dataValues.email,existingUser.dataValues.username);
    res.status(StatusCodes.OK).json({
        message: 'refresh token',
        user: existingUser,
        refreshToken: userJwt
    })
}