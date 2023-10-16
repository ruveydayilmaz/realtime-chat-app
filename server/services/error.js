const apiResponse = require('../utils/apiResponse');

/**
 * @extends Error
 */
class ExtendableError extends Error {
	constructor(message, status) {
		super(message);
		this.message = message;
		this.status = status;
	}
}

class APIError extends ExtendableError {
	/**
   * Creates an API error.
   *
   * @param {String} message - Error message.
   * @param {Number} status - HTTP status code of error.
   */
	constructor(message, status = apiResponse.API_STATUS.UNPROCESSABLE_ENTITY, err = {}) {

		if(message===null) {
			message = err.message;
		}
		super(message, status);
	}
}

module.exports = APIError;
