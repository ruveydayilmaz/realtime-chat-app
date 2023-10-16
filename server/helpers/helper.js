// UTILS / HELPERS / SERVICES
const APIError = require('../services/error.js');
const apiResponse = require('../utils/apiResponse.js');

const client = require('../config/redis');

const ONE_HOUR = 60 * 60;
const ONE_DAY = ONE_HOUR * 24;
const THREE_MIN = 180;

const generateCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

exports.checkVerificationCode = async (emailOrPhone, code) => {
    return new Promise((resolve, reject) => {
      client.get(emailOrPhone, function (err, storedCodeString) {
        if (err) {
          return reject(err);
        }
  
        const storedCode = storedCodeString !== null ? storedCodeString.toString() : null;
        resolve(storedCode === code.toString());
      });
    });
};  
  

exports.generateVerificationCode = async (emailOrPhone) => {
    const code = generateCode();
    const key = emailOrPhone;

    await client.SET(key, code, 'EX', ONE_HOUR, (err) => {
        if (err) {
        console.log(err.message)
        reject(next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, err.message)))
        }
    });

    return code;
};

exports.setVerified = async (emailOrPhone) => {
    const key = emailOrPhone;
    const value = 'true';

    await client.SET(key, value, 'EX', ONE_DAY, (err) => {
        if (err) {
        console.log(err.message)
        reject(next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, err.message)))
        }
    });

    return value;
};

exports.generateForgotPasswordCode = async (emailOrPhone) => {
  const code = generateCode();
  const key = `forgot:${emailOrPhone}`;

  await client.SET(key, code, 'EX', ONE_HOUR, (err) => {
      if (err) {
      console.log(err.message)
      reject(next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, err.message)))
      }
  });

  return code;
};

exports.checkForgotPasswordCode = async (emailOrPhone, code) => {
  const key = `forgot:${emailOrPhone}`;

  return new Promise((resolve, reject) => {
    client.get(key, function (err, storedCodeString) {
      if (err) {
        return reject(err);
      }

      const storedCode = storedCodeString !== null ? storedCodeString.toString() : null;
      resolve(storedCode === code.toString());
    });
  });
};  

exports.getCachedData = async (data) => {
  return new Promise((resolve, reject) => {
    client.get(data, function (err, cacheResults) {
      if (err) {
        return reject(err);
      }

      const storedData = JSON.parse(cacheResults);
      resolve(storedData);
    });
  });
};

exports.cacheData = async (cacheData) => {
  return new Promise((resolve, reject) => {
    client.SET(cacheData.key, JSON.stringify(cacheData.data), 'EX', THREE_MIN, (err) => {
      if (err) {
        console.log(err.message);
        reject(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, err.message));
      }
      resolve();
    });
  });
};
