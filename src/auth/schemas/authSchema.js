const Joi = require('joi');

const emailValidation = Joi.string().email();
const phoneValidation = Joi.string().pattern(/^\+?[1-9]\d{1,14}$/);
const idValidation = Joi.alternatives(emailValidation, phoneValidation)
  .required()
  .messages({
    'alternatives.match': 'Id must be an email or phone',
  });

const authSchema = Joi.object({
  id: idValidation,
  password: Joi.string()
    .regex(/[a-zA-Z0-9]{3,30}/)
    .required(),
});

const refreshTokenSchema = Joi.object({
  token: Joi.string().required(),
});

module.exports = {
  authSchema,
  refreshTokenSchema,
};
