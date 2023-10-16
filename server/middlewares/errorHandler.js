// UTILS / HELPERS / SERVICES
const APIError = require('../services/error');
const apiResponse = require('../utils/apiResponse');
const createLogger = require('../config/winston');

exports.errorHandler = (err, req, res, next) => {
  if (!err) return new APIError('Error', apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, err);

  const error = {
    success: false,
    data: [],
    message: err.message || 'Internal Server Error',
  };

  const controllerNameRegex = /\/v\d+\/(\w+)\//;
  const matches = req.originalUrl.match(controllerNameRegex);
  const controllerName = matches ? matches[1] : 'errors';

  const time = new Date().toLocaleString();
  const logger = createLogger(controllerName);
  logger.error(`${req.ip} - - [${time}] ${req.method} | ${req.originalUrl} - - [ ${error.message} ] `);

  res.status(err.status || apiResponse.API_STATUS.UNPROCESSABLE_ENTITY).json(error);
  return;
};

