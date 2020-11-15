import asyncHandler from 'express-async-handler';
/**
 * @desc   This middleware builds paganiation object and pass forward pagination params:
 *
 *
 * Params added to api request:
 *
 * @param pagination   Name of the pagination object. Return this object
 * with in response results to frontend.
 *
 * @param skip   Pagination offset (start index).
 *
 * @param limit max number of documents to return per request
 */

//

const paginate = (model) => {
  return asyncHandler(async (req, res, next) => {
    const pagination = {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const search = req.query.search;

    const query = search
      ? {
          name: {
            $regex: search.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&'),
            $options: 'i',
          },
        }
      : {};

    const documents = await model.countDocuments({ ...query }).exec();
    const totalPages = Math.ceil(documents / limit);

    if (page > totalPages || page < 0) {
      res.status(400);
      throw new Error('Page not found');
    }

    if (page > 1) {
      pagination.previos = page - 1;
    }

    if (page < totalPages) {
      pagination.next = page + 1;
    }

    pagination.total = totalPages;
    pagination.page = page;
    pagination.perPage = limit;

    req.pagination = pagination;
    req.skip = (page - 1) * limit;
    req.limit = limit;

    next();
  });
};

export { paginate };
