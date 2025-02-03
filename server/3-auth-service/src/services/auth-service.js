import jwt from "jsonwebtoken";
import { AuthModel } from "../models/auth.schema.js";
import { publishDirectMessage } from "../queues/auth.producer.js";
import { Op } from 'sequelize';
import { winstonLogger } from '@sachinsingh53/jobber-shared';
import config from '../config.js';
import{authChannel} from '../app.js'

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'AuthService', 'debug');



async function createUser(data) {
    try {
        const result = await AuthModel.create(data);
        const messageDetails = {
            username: result.dataValues.username,
            email: result.dataValues.email,
            createdAt: result.dataValues.createdAt,
            type: 'auth'
        };


        
        await publishDirectMessage(
            authChannel,
            'jobber-buyer-updates',
            'user-buyer',
            JSON.stringify(messageDetails)
        );
        return result;
    } catch (err) {
        log.error('error', 'AuthService createUser()', err);
    }
}

async function getUserById(authId) {
    try {
        const user = await AuthModel.findOne({
            where: { id: authId },
            attributes: {
                exclude: ['password']
            }
        });

        return user;
    } catch (error) {
        log.error(error);
    }
}

async function getUserByUsernameOrEmail(username, email) {
    const user = await AuthModel.findOne({
        where: {
            [Op.or]: [{ username: username }, { email: email }]
        }
    });

    return user;
}

async function getUserByUsername(username) {
    try {
        const user = await AuthModel.findOne({
            where: { username: username.toLowerCase() },
            // attributes: {
            //     exclude: ['password']
            // }
        });
        

        return user;
    } catch (error) {

        log.error(error);
    }
}

async function getUserByEmail(email) {
    try {
        const user = await AuthModel.findOne({
            where: { email: email.toLowerCase() },
            // attributes: {
            //     exclude: ['password']
            // }
        });

        return user;
    } catch (error) {
        log.error(error);
    }
}

async function getUserByVerificationToken(token) {
    try {
        const user = await AuthModel.findOne({
            where: { emailVerificationToken: token },
            attributes: {
                exclude: ['password']
            }
        });

        return user;
    } catch (error) {
        log.error(error);
    }
}

async function getAuthUserByPasswordToken(token) {
    try {
        const user = await AuthModel.findOne({
            where: {
                [Op.and]: [{ passwordResetToken: token }, { passwordResetExpires: { [Op.gt]: new Date() } }]
            }
        });

        return user;
    } catch (error) {
        log.error(error);
    }
}

async function updateVerifyEmailField(authId, token, emailVerified) {
    try {
        await AuthModel.update(
            {
                emailVerified: emailVerified,
                emailVerificationToken: token
            },
            {
                where: { id: authId }
            }
        );
    } catch (error) {
        log.error(error);
    }
}

async function updatePasswordToken(authId, token, tokenExpiration) {
    try {

        // if (tokenExpiration instanceof Date) {
        //     tokenExpiration = tokenExpiration.toISOString();
        // }

        await AuthModel.update(
            {
                passwordResetToken: token,
                passwordResetExpires: tokenExpiration
            },
            {
                where: { id: authId }
            }
        );
        
    } catch (error) {

        log.error(error);
    }
}

async function updatePassword(authId, password) {
    try {
        await AuthModel.update(
            {
                password,
                passwordResetToken: '',
                passwordResetExpires: new Date()
            },
            {
                where: { id: authId }
            }
        );
    } catch (error) {
        log.error(error);
    }
}

function signToken(id, email, username) {
    try {
        return jwt.sign(
            {
                id,
                email,
                username
            },
            config.JWT_TOKEN
        );
    } catch (error) {
        log.error(error);
    }
}

export {
    createUser,
    getUserById,
    getUserByUsernameOrEmail,
    getUserByUsername,
    getUserByEmail,
    getUserByVerificationToken,
    getAuthUserByPasswordToken,
    updateVerifyEmailField,
    updatePasswordToken,
    updatePassword,
    signToken,
};
