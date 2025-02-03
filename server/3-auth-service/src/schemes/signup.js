import Joi from 'joi';

const signupSchema = Joi.object({
    username: Joi.string().min(4).max(12).required(),
    password: Joi.string().min(4).max(12).required(),
    email: Joi.string().email().required()
});

export default signupSchema;
