const JWT = require('jsonwebtoken')
const client = require('../config/redis')

const APIError = require('../services/error.js');
const apiResponse = require('../utils/apiResponse');
const config = require('../config/config');

exports.verifyRefreshToken = (refreshToken, next) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      config.refreshToken,
      (err, payload) => {
        if (err) return next(new APIError(null, apiResponse.API_STATUS.UNAUTHORIZED, err));
        const userId = payload._id;

        client.GET(userId, (err, result) => {
          if (err) {
            console.log(err.message);
            next(new APIError(null, apiResponse.API_STATUS.SERVER_ERROR, err));
            return
          }

          if (refreshToken === result) return resolve(userId);
          next(new APIError('You are not authorized', apiResponse.API_STATUS.UNAUTHORIZED, null));
        })
      }
    )
  })
}

exports.removeRefreshToken = (userId, next) => {
  return new Promise((resolve, reject) => {
    client.DEL(userId, (err, val) => {
      if (err) {
        console.log(err.message);
        next(new APIError(null, apiResponse.API_STATUS.SERVER_ERROR, err));
        return
      }

      return resolve(val);
    })
  })
}
