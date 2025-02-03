import config from "../config.js";
import { publishDirectMessage } from "../queues/auth.producer.js";
import signupSchema from "../schemes/signup.js";
import { getUserByUsernameOrEmail, createUser, signToken } from "../services/auth-service.js";
import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { winstonLogger } from '@sachinsingh53/jobber-shared';
import { BadRequestError } from '@sachinsingh53/jobber-shared';
import {authChannel} from '../app.js'

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'AuthController', 'debug');

export const create = async (req, res) => {


    const { error } = signupSchema.validate(req.body);
    if (error) {
        throw new BadRequestError(error.details[0].message, 'SignUp create() method error');
    }

    const { username, password, email } = req.body;
    const checkIfUserExists = await getUserByUsernameOrEmail(username, email);
    
    if (checkIfUserExists) {
        throw new BadRequestError('Invalid credentials. Email or Username', 'SignUp create() method error');
    }

    const randomCharacters = crypto.randomBytes(20).toString('hex');

    const authData = {
        username: username.toString(),
        email: email.toString(),
        password,
        emailVerificationToken: randomCharacters
    }



    const result = await createUser(authData);

    // console.log(result);


    const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=${authData.emailVerificationToken}`;

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

    const userJWT = signToken(result.id, result.email, result.username);

    res.status(StatusCodes.CREATED).json({
        message: 'user created successfully',
        user: result,
        token: userJWT
    })

}

