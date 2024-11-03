import mongoose from "mongoose";
import httpStatus from "http-status";

import envVars from "../config/envVars.config.js";
import { APIError } from "../utils/APIError.js";
import { APIResponse } from "../utils/APIResponse.js";

import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";

import { createApiResponse } from "../utils/createApiResponse.js";
import { createApiError } from "../utils/createApiError.js";

/**
 * Error handling middleware to format and send JSON error responses.
 * @param {Error} err - The error object.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
const handleError = (err, req, res, next) => {
  try {
    // Determine status code and message based on the error
    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message =
      statusCode >= 500
        ? httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
        : err.message || httpStatus[statusCode];

    // Create error object with additional properties for development environment
    const error = {
      ...err, // Spread all properties of the original error
      message, // Override message with determined message
      ...(envVars.env === "development" && { stack: err.stack }), // Include stack trace in development mode
    };

    // Create APIResponse with error details
    const errorResponse = {
      error,
      message,
      statusCode,
      status: false,
    };

    // Send JSON response with appropriate status code
    res.status(statusCode).json(errorResponse);
  } catch (error) {
    console.error("error.middleware : handleError : error : ", error);
    next(error); // Pass any caught error to the next middleware
  }
};

/**
 * Middleware to convert non-APIError errors to APIError instances.
 * @param {Error} err - The error object.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
const convertError = (err, req, res, next) => {
  try {
    logger.error("error.middleware : convertError : original error : ", err);
    // Check if the error is not already an instance of APIError
    if (!(err instanceof APIError)) {
      // Determine status code and message for non-APIError errors
      // const statusCode =
      //   err.statusCode ||
      //   (err instanceof mongoose.Error
      //     ? httpStatus.BAD_GATEWAY
      //     : httpStatus.INTERNAL_SERVER_ERROR);
      // const message =
      //   err.message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR];

      let statusCode = err.statusCode;
      if (err instanceof mongoose.Error) {
        statusCode = httpStatus.BAD_GATEWAY;
      } else if (err instanceof jwt.JsonWebTokenError) {
        statusCode = httpStatus.UNAUTHORIZED;
      } else {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      }
      const message =
        err.message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR];

      // Create new APIError instance
      const apiError = createApiError(statusCode, message, false);

      // Pass the APIError instance to the next middleware
      next(apiError);
    } else {
      // Pass the APIError to the next middleware if it's already an APIError
      next(err);
    }
  } catch (error) {
    console.error("error.middleware : convertError : error : ", error);
    next(error); // Pass any caught error to the next middleware
  }
};

export { handleError, convertError };
