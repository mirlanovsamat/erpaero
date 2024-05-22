function errorHandler(err, req, res, next) {
  const statusCode = err?.statusCode ? err.statusCode : 500;

  const responseBody = {
    message: err.message,
  };

  console.error('Error: ', err);
  res.status(statusCode).json(responseBody);
}

module.exports = errorHandler;
