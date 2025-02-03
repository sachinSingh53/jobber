import { StatusCodes } from "http-status-codes";
import { authService } from "../../services/api/auth-service.js";

export const verifyEmail = async (req, res) => {
    const response = await authService.verifyEmail(req.body.token);
    res.status(StatusCodes.OK).json({
        message: response.data.message,
        user: response.data.user
    });
};
