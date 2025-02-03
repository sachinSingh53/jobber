import { StatusCodes } from "http-status-codes";
import { authService } from "../../services/api/auth-service.js";

export const read = async (req, res) => {
    const response = await authService.signIn(req.body);

    req.session = { jwt: response.data.token };

    res.status(StatusCodes.OK).json({
        message: response.data.message,
        user: response.data.user
    });
};
