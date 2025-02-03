import { StatusCodes } from "http-status-codes";
import { authService } from "../../services/api/auth-service.js";

export const forgotPassword = async (req, res) => {
    const response = await authService.forgotPassword(req.body.email);

    res.status(StatusCodes.OK).json({
        message: response.data.message,
    });
};

export const resetPassword = async (req, res) => {
    const {password, confirmPassword} = req.body;
    const response = await authService.resetPassword(req.params.token,password,confirmPassword);

    res.status(StatusCodes.OK).json({
        message: response.data.message,
    });
};

export const changePassword = async (req, res) => {
    const {currentPassword, newPassword} = req.body;
    const response = await authService.changePassword(currentPassword,newPassword);
    
    res.status(StatusCodes.OK).json({
        message: response.data.message,
    });
};
