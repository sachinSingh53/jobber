import Joi from 'joi';

const emailSchema = Joi.object({
  email: Joi.string().email().required()
});

const passwordSchema = Joi.object({
  password: Joi.string().required().min(4).max(12),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().min(4).max(12),
  newPassword: Joi.string().required().min(4).max(12)
});

export { emailSchema, passwordSchema, changePasswordSchema };
