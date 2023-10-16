/**
 * Middleware function to handle pagination of data.
 *
 * Sets up pagination details based on query parameters and attaches them to the request and response objects.
 * Provides a pagination process function to modify a model object with the appropriate limit, skip, and sorting.
 *
 * @param {Object} options - Options object
 * @param {String} [options.prefix=''] - Prefix to differentiate the pagination details for each model
 * @returns {Function} Express middleware function
 */
exports.pagination = ({ prefix = '' } = {}) => (req, res, next) => {
  const page = prefix? prefix + 'Page' : 'page';

  const paginationDetails = {
    page: req.query[page] ? parseInt(req.query[page]) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 30,
    orderBy: req.query.orderBy || 'createdAt',
    orderAsc: req.query.orderAsc === '1' ? 1 : -1,
  };

  req[prefix + 'Pagination'] = paginationDetails;
  res[prefix + 'Pagination'] = paginationDetails;
  res.pagination = true;

  req[prefix + 'PaginationProcess'] = async function (model, filter) {
    const { page, limit, orderBy, orderAsc } = this[prefix + 'Pagination'];

    const order = {};
    order[orderBy] = orderAsc;

    const skip = (page - 1) * limit;

    return await model
      .find(filter)
      .sort(order)
      .skip(skip)
      .limit(limit);
  };

  next();
};
