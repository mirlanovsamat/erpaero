const { HttpError } = require('../errors');

const validateRequestBody = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body);
    if (result.error) {
      throw new HttpError(
        400,
        result.error.details.map(({ message }) => message)
      );
    }
    if (!req.value) {
      req.value = {};
    }
    req.value['body'] = result.value;
    next();
  };
};

const validateRequestQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.query);
    if (result.error) {
      throw new HttpError(
        400,
        result.error.details.map(({ message }) => message)
      );
    }
    if (!req.value) {
      req.value = {};
    }
    req.value['body'] = result.value;
    next();
  };
};

module.exports = { validateRequestBody, validateRequestQuery };
