const Joi = require('joi');

const fileListSchema = Joi.object({
  list_size: Joi.number(),
  page: Joi.number(),
});

module.exports = {
  fileListSchema,
};
