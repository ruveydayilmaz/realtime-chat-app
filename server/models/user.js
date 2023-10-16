const {Schema, model} = require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// UTILS / HELPERS / SERVICES
const APIError = require('../services/error.js');
const apiResponse = require('../utils/apiResponse.js');
const client = require('../config/redis.js');
const config = require('../config/config.js');

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash the user password on creation
UserSchema.pre('save', async function(next) {
  try {
    this.password = this._hashPassword(this.password);

    return next();
  } catch (err) {
    console.error(err);
    return next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, err.message));
  }
});

UserSchema.methods = {
  /**
   * Authenticate the user
   *
   * @public
   * @param {String} password - provided by the user
   * @returns {Boolean} isMatch - password match
   */
  async authenticateUser(password) {
      return await bcrypt.compare(password, this.password);
  },
  
  /**
   * Hash the user password
   *
   * @private
   * @param {String} password - user password choose
   * @returns {String} password - hash password
   */
  _hashPassword(password) {
      return hashSync(password);
  },

  /**
   * Generate a JWT access token for authentication
   * @async
   * @public
   * @param {Function} next - Express next function
   * @returns {Promise<string>} The generated JWT access token
   */
  createAccessToken(next) {
      return new Promise((resolve, reject) => {
          const payload = {_id: this._id};
          const secret = config.accessToken;
          const options = {
              expiresIn: config.tokenExpiresIn,
          }

          JWT.sign(payload, secret, options, (err, token) => {
              if (err) {
                  console.log(err.message)
                  reject(next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, err.message)))
              }
              resolve(token)
          })
      })
  },

  /**
   * Generate a jwt refresh token for authentication
   * @async
   * @public
   * @param {Function} next - Express next function
   * @returns {Promise<String>} The generated JWT refresh token
   */
  createRefreshToken(next) {
      return new Promise((resolve, reject) => {
        const payload = {_id: this._id};
        const secret = config.refreshToken;
        const options = {
          expiresIn: config.tokenExpiresIn,  // * sayi (1 yil olacak sekilde)
        }

        JWT.sign(payload, secret, options, (err, token) => {
          if (err) {
            console.log(err.message)
            reject(next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, err.message)))
          }

          const id = this._id.toString();
          // client.SET(id, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
          //   if (err) {
          //     console.log(err.message)
          //     reject(next(new APIError(null, apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, err.message)))
          //   }

          //   resolve(token)
          // }) DUZELT
          resolve(token);
        })
      })
  },

};

const UserModel = model("Users", UserSchema);

module.exports = UserModel;