import jwt from 'jsonwebtoken';
import config from '../config.js';
import { NotAuthorizedError } from '@sachinsingh53/jobber-shared';

class AuthMiddleware {

    verifyUser(req, res, next) {
        if (!req.session.jwt) {
            
            throw new NotAuthorizedError('Token is not available. Please login again.', 'GatewayService verifyUser() method error')
        }
        try {
            const payload = jwt.verify(req.session.jwt, `${config.JWT_TOKEN}`);
            req.currentUser = payload;
        } catch (err) {
            throw new NotAuthorizedError('Token is not available. Please login again.', 'GatewayService verifyUser() method invalid session error');
        }
        next();
    }

    checkAuthentication(req, res, next) {
        if (!req.currentUser) {
            throw new NotAuthorizedError('Authentication is required to access this route.', 'GatewayService checkAuthentication() method error');
        }
        next();
    }
}

const authMiddleware = new AuthMiddleware();

export default authMiddleware;
