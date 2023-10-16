const { getCachedData } = require("../helpers/helper");
const apiResponse = require('../utils/apiResponse');

exports.getCacheData = (data) => async (req, res, next) => {
    const key = `${req.payload._id}:${data}`;
    
    try {
      const cacheResults = await getCachedData(key);
      if (cacheResults) {
        const results = {[data] : cacheResults, fromCache: true};
        return apiResponse.successResponse(res, req.t("SuccessfullyFetched", { model: data}), results);
      } else {
        next();
      }
    } catch (error) {
      console.error(error);
      res.status(404);
    }
};