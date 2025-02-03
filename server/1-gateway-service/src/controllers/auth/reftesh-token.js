import { StatusCodes } from "http-status-codes";
import { authService } from "../../services/api/auth-service.js";


//to find currentUser
export const token = async (req, res) => {
    const response = await authService.getRefreshToken(req.params.username);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        user: response.data.user,
        refreshToken: response.data.refreshToken
    });
};

