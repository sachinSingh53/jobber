import { BadRequestError, NotAuthorizedError } from "@sachinsingh53/jobber-shared";
import { lowerCase } from "@sachinsingh53/jobber-shared";
import { getUserByEmail, getUserById, updateVerifyEmailField } from "../services/auth-service.js";
import{StatusCodes} from 'http-status-codes'
import config from '../config.js'
import { authChannel } from "../app.js";
import { publishDirectMessage } from "../queues/auth.producer.js";
import crypto from 'crypto';
//to find current user
export async function read(req,res){
    let user = null;

    const existingUser = await getUserById(req.currentUser.id);
    if(!existingUser){
        throw new NotAuthorizedError('Not authorized, Please login again','current-user controller read() method error');
    }
    if(Object.keys(existingUser).length){
        user = existingUser;
    }

    res.status(StatusCodes.OK).json({
        message:'authenticated user',
        user,
    })

    
}

//this function is for generate resend email verification link when user is signup but not verified their email
export async function resendEmail(req,res){
    const {email,userId} = req.body;

    const checkIfUserExist = await getUserByEmail(lowerCase(email));
    if(!checkIfUserExist){
        throw new BadRequestError('Email is invalid','resend email method error');
    }

    const randomCharacters =  crypto.randomBytes(20).toString('hex');
    const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${randomCharacters}`;

    await updateVerifyEmailField(parseInt(userId),randomCharacters,0);


    const messageDetails = {
        receiverEmail: email,
        verifyLink: verificationLink,
        template: 'verifyEmail'
    }




    await publishDirectMessage
        (   authChannel,
            'jobber-email-notification',
            'auth-email',
            JSON.stringify(messageDetails)
        );

    const updatedUser = await getUserById(parseInt(userId));


    res.status(StatusCodes.OK).json({
        message:'Email verification sent',
        user: updatedUser
    })
}