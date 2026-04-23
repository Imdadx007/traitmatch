// Standard API Response
export const apiResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    ...(data && { data }),
  });
};

// Success response
export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  apiResponse(res, statusCode, true, message, data);
};

// Error response
export const sendError = (res, message, data = null, statusCode = 400) => {
  apiResponse(res, statusCode, false, message, data);
};

// Pagination helper
export const getPaginationParams = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Build pagination response
export const buildPaginationResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};
