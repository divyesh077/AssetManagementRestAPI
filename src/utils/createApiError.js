import { APIError } from "./APIError.js";

const createApiError = (
  statusCode,
  message,
  isOperational = true,
  stack = ""
) => {
  const apiError = new APIError(statusCode, message, isOperational, stack);
  return apiError;
};

export { createApiError };
