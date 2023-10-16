// PACKAGES
const bcrypt = require('bcrypt');

// UTILS / HELPERS / SERVICES
const APIError = require('../services/error.js');
const apiResponse = require('../utils/apiResponse.js');
const {verifyRefreshToken, removeRefreshToken} = require('../helpers/jwt.js');
const {
  checkVerificationCode,
  generateVerificationCode,
  setVerified,
  generateForgotPasswordCode,
  checkForgotPasswordCode,
} = require("../helpers/helper.js");

// MODELS
const User = require('../models/user.js');
const { sendEmail } = require('../helpers/mailer.js');

const authController = {};

authController.sendOtpToEmail = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
    };

    const existingUser = await User.findOne({email: data.email});
    if(existingUser && existingUser.verified.isVerified) return apiResponse.notFoundResponse(res, req.t("AlreadyVerified"), next);

    const code = await generateVerificationCode(data.email);
    await sendEmail({ toUser: data.email, code, type: 0 });

    const responseData = {
      sent: true
    };

    return apiResponse.successResponse(res, req.t("SuccessfulSentOtp", {provider: "email"}), responseData);
  } catch (error) {
    next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, error));
  }
};

authController.verifyEmail = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
      code: req.body.code,
    };

    const filter = {email: data.email};
    const existingUser = await User.findOne(filter);
    if(existingUser && existingUser.verified.isVerified) return apiResponse.notFoundResponse(res, req.t("AlreadyVerified"), next);

    const key = data.email;
    const isCorrect = await checkVerificationCode(key, data.code);
    if(!isCorrect) return apiResponse.validationErrorResponse(res, req.t("InvalidCode"), next);

    const status = await setVerified(key);

    const responseData = {
      verified: status,
    };

    return apiResponse.successResponse(res, req.t("SuccessfullyVerified"), responseData);
  } catch (error) {
    next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, error));
  }
};

authController.register = async (req, res, next) => {
    try {
      const data = {
        email: req.body.email,
        firstname: req.body.firstname,
        username: req.body.username,
        password: req.body.password,
        verified: true,
      };

      const existingUser = await User.findOne({email: data.email});
      if(existingUser) return apiResponse.alreadyExistsResponse(res, req.t("UserAlreadyExists"), next);

      const provider = "email";
      const key = data.email;
      const isVerified = await checkVerificationCode(key, 'true');
      if(!isVerified) return apiResponse.notFoundResponse(res, req.t("NotVerified", {provider: provider}), next);

      const createdUser = await User.create(data);
      if(!createdUser) return apiResponse.serverErrorResponse(res, req.t("UnableToCreate", { model: "user"}));

      const accessToken = await createdUser.createAccessToken(next);
      const refreshToken = await createdUser.createRefreshToken(next);

      const responseData = {
        user: {
          _id: createdUser._id,
          firstname: createdUser.firstname,
          username: createdUser.username,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return apiResponse.successResponse(res, req.t("SuccessfullyRegistered"), responseData);
    } catch (error) {
      next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, error));
    }
};

authController.login = async (req, res, next) => {
    try {
      const data = {
        // email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      };

      const filter = {username: data.username};
      const user = await User.findOne(filter);
      if (!user) return apiResponse.notFoundResponse(res, req.t("NotFound", { model: "user"}));

      if(!user.verified) return apiResponse.unauthorizedResponse(res, req.t("VerifyAccount"));

      const isMatch = await user.authenticateUser(data.password);
      if (!isMatch) return apiResponse.unauthorizedResponse(res, req.t("InvalidCredentials"));

      const accessToken = await user.createAccessToken(next);
      const refreshToken = await user.createRefreshToken(next);

      const responseData = {
        user: {
          _id: user._id,
          firstname: user.firstname,
          // profilePicture: user.profilePicture,
          username: user.username,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return apiResponse.successResponse(res, req.t("SuccessfulLogin"), responseData);
    } catch (error) {
      console.log(error)
      next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, error));
    }
};

authController.refreshToken = async (req, res, next) => {
    try {
      const data = {
        refreshToken: req.body.refreshToken,
      };

      const userId = await verifyRefreshToken(data.refreshToken, next)
      if (!userId) return apiResponse.notFoundResponse(res, req.t("NotFoundToken"));

      const user = await User.findOne({_id: userId})
      if (!user) return apiResponse.notFoundResponse(res, req.t("NotFound", {model: 'user'}));

      const accessToken = await user.createAccessToken(next);

      const responseData = {
        accessToken: accessToken,
      };

      return apiResponse.successResponse(res, req.t("SuccessfullyRefreshed"), responseData);
    } catch (error) {
      next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, error));
    }
};

authController.logout = async (req, res, next) => {
    try {
      const data = {
        refreshToken: req.body.refreshToken,
      };

      const userId = await verifyRefreshToken(data.refreshToken, next);
      if (!userId) return apiResponse.notFoundResponse(res, req.t("NotFoundToken"));

      const val = await removeRefreshToken(userId, next);

      const responseData = {
        val: val,
      };

      return apiResponse.successResponse(res, req.t("SuccessfulLogout"), responseData);

    } catch (error) {
      next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, error));
    }
};

authController.forgotPassword = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
    };

    const filter = {email: data.email};
    const user = await User.findOne(filter);
    if(!user) return apiResponse.notFoundResponse(res, req.t("NotFound", {model: "user"}), next);

    const key = data.email; 
    const code = await generateForgotPasswordCode(key);

    await sendEmail({ toUser: data.email, code, type: 1 });
    const provider = "email";

    const responseData = {
      sent: true
    };

    return apiResponse.successResponse(res, req.t("SuccessfulSentOtp", {provider: provider}), responseData);

  } catch (error) {
    next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, error));
  }
};

authController.resetPassword = async (req, res, next) => {
  try {
    const data = {
      email: req.body.email,
      code: req.body.code,
      newPassword: req.body.newPassword,
    };

    const filter = {email: data.email};

    const key = data.email;
    const isCorrect = await checkForgotPasswordCode(key, data.code);
    if(!isCorrect) return apiResponse.validationErrorResponse(res, req.t("InvalidCode"), next);

    const hashedPassword = await bcrypt.hash(data.newPassword, 12);
    const updateData = {password: hashedPassword};
    const updatedUser = await User.findOneAndUpdate(filter, updateData, {new: true});
    if(!updatedUser) return apiResponse.serverErrorResponse(res, req.t("UnableToUpdateProfile"));

    const responseData = {
      updated: true
    };

    return apiResponse.successResponse(res, req.t("SuccessfulPasswordUpdate"), responseData);

  } catch (error) {
    next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, error));
  }
};

module.exports = authController;
