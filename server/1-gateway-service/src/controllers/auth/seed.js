import { authService } from '../../services/api/auth-service.js';
import { StatusCodes } from 'http-status-codes';


async function create(req, res) {
    const response = await authService.seed(req.params.count);
    res.status(StatusCodes.OK).json({ message: response.data.message });
}

export {
    create
}
