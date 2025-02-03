import { StatusCodes } from "http-status-codes";
import { authService } from "../../services/api/auth-service.js";

export const create = async (req, res) => {
    const response = await authService.signUp(req.body);

    req.session = { jwt: response.data.token };

    res.status(StatusCodes.CREATED).json({
        message: response.data.message,
        user: response.data.user
    });
};
