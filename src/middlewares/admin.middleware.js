import asyncHandler from "express-async-handler";
import httpStatus from "http-status";

import { createApiError } from "../utils/createApiError.js";

export const admin = asyncHandler((req, res, next) => {
  const { user } = req;
  if (!user) {
    const apiError = createApiError(
      httpStatus.UNAUTHORIZED,
      "User does not have permission for request!!!"
    );
    return next(apiError);
  }
  if (user.role !== "admin") {
    const apiError = createApiError(
      httpStatus.UNAUTHORIZED,
      "User does not have permission for request!!!"
    );
    return next(apiError);
  }
  next();
});
