import Joi from 'joi';

const loginSchema = Joi.object({
    // Here we are assuming that the user can log in either via username or via email
    username: Joi.alternatives().conditional(Joi.string().email(), {
        then: Joi.string().email().required(),
        otherwise: Joi.string().min(4).max(12).required()
    }),
    password: Joi.string().min(4).max(12).required()
});

export  {loginSchema};
