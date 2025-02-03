import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from './errors.js';

const tokens = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];

export function verifyGatewayRequest(req, res, next) {
    if (!req.headers.gatewaytoken) {
        throw new NotAuthorizedError('Request coming from invalid source', 'jobber-shared gatewayMiddleware verifyGatewayRequest()')
    }

    const token = req.headers.gatewaytoken;

    if (!token) {
        throw new NotAuthorizedError('Request coming from invalid source', 'jobber-shared gatewayMiddleware verifyGatewayRequest()')
    }

    try {
        const payload = jwt.verify(token, '7b3849a6465a5694200965646ea5a56f');
        if (!tokens.includes(payload.id)) {
            throw new NotAuthorizedError('Request coming from invalid source', 'jobber-shared gatewayMiddleware verifyGatewayRequest()')
        }
    } catch (err) {
        throw new NotAuthorizedError('Request coming from invalid source', 'jobber-shared gatewayMiddleware verifyGatewayRequest()')
    }

    next();
}

// export { verifyGatewayRequest };
