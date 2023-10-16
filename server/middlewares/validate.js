// UTILS / HELPERS / SERVICES
const apiResponse = require('../utils/apiResponse');

validate = (schema) => (req, res, next) => {
  const options = {
    errors: {
      wrap: {
        label: ''
      }
    }
  };

  const validateObject = Object.keys(req.params).length > 0 ? req.params : req.body;

  try {
    const { error, value } = schema.validate(validateObject, options);

    if (error) {
      const errorMessage = error.details?.map((detail) => detail.message).join(', ');
      return apiResponse.validationErrorResponse(res, errorMessage);
    }

    Object.assign(req, value);
    next();
  } catch (err) {
    console.log(err.message);
    return apiResponse.serverErrorResponse(res, 'Server error')
  }
};

module.exports = validate;