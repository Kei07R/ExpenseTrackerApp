const ERROR_CODES = {
  VALIDATION_FAILED: {
    statusCode: 400,
    message: "Validation failed",
    code: "VALIDATION_ERROR",
  },
  INVALID_ARGUMENTS: {
    statusCode: 400,
    message: "Invalid arguments provided",
    code: "INVALID_ARG_ERROR",
  },
  UNAUTHORIZED: {
    statusCode: 401,
    message: "Authentication required",
    code: "UNAUTHORIZED_ACCESS",
  },
  FORBIDDEN: {
    statusCode: 403,
    message: "Access denied",
    code: "FORBIDDEN_RESOURCE",
  },
  NOT_FOUND: {
    statusCode: 404,
    message: "Resource not found",
    code: "NOT_FOUND_ERROR",
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    message: "An unexpected error occurred",
    code: "SERVER_ERROR",
  },
};

module.exports = ERROR_CODES;
