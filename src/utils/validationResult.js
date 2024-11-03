import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";

import { createApiError } from "./createApiError.js";

const validateResult = asyncHandler((req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = result.errors[0].msg;
    const apiError = createApiError(statusCode, message);
    next(apiError);
  }
  next();
});

export { validateResult };
