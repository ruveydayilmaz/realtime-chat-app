'use strict';

const API_STATUS = {
    API_SUCCESS: 200, // Success
    UNAUTHORIZED: 401, // Login Required
    BAD_REQUEST: 400, // Token Expired
    SERVER_ERROR: 500, // Server Issue
    UNPROCESSABLE_ENTITY: 422, // Validation Failed
    FORBIDDEN: 403, // User Is Blocked
    NOT_FOUND: 404, // Not Found
    CONFLICT: 409 // Already Exists
};

exports.API_STATUS = API_STATUS;

exports.successResponse = (res, msg, data) => {
  const resData = {
    success: true,
    data: [data],
    message: msg,
  };

  if (res.pagination) {
    resData['pagination'] = true;
  } else {
    resData['pagination'] = false;
  }

  return res.status(API_STATUS.API_SUCCESS).json(resData);
}

exports.notFoundResponse = (res, msg) => {
  const resData = {
    success: false,
    data: [],
    message: msg,
  };

  return res.status(API_STATUS.NOT_FOUND).json(resData);
}

exports.validationErrorResponse = (res, msg) => {
  const resData = {
    success: false,
    data: [],
    message: msg,
  };

  return res.status(API_STATUS.UNPROCESSABLE_ENTITY).json(resData);
}

exports.unauthorizedResponse = (res, msg) => {
  const resData = {
    success: false,
    data: [],
    message: msg,
  };

  return res.status(API_STATUS.UNAUTHORIZED).json(resData);
}

exports.expiredAuthResponse = (res, msg) => {
  const resData = {
    success: false,
    data: [],
    message: msg,
  };

  return res.status(API_STATUS.BAD_REQUEST).json(resData);
}

exports.alreadyExistsResponse = (res, msg) => {
  const resData = {
    success: false,
    data: [],
    message: msg,
  };

  return res.status(API_STATUS.CONFLICT).json(resData);
}

exports.serverErrorResponse = (res, msg) => {
  const resData = {
    success: false,
    data: [],
    message: msg,
  };

  return res.status(API_STATUS.SERVER_ERROR).json(resData);
}

exports.forbiddenResponse = (res, msg) => {
  const resData = {
    success: false,
    data: [],
    message: msg,
  };

  return res.status(API_STATUS.FORBIDDEN).json(resData);
}