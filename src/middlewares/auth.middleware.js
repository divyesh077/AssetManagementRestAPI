import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import envVars from "../config/envVars.config.js";

import userService from "../services/user.service.js";
import tokenService from "../services/token.service.js";
import httpStatus from "http-status";

import { createApiError } from "../utils/createApiError.js";

const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  const token =
    (authorization &&
      authorization.startsWith("Bearer ") &&
      authorization.split(" ")[1]) ||
    req.cookies?.accessToken;

  if (!token) {
    const apiError = createApiError(
      httpStatus.UNAUTHORIZED,
      "user is not authorized : token!!!"
    );
    return next(apiError);
  }
  const payload = jwt.verify(token, envVars.jwt.accessSecret);

  const user = await userService.getUserById(payload.sub);

  if (!user) {
    const apiError = createApiError(
      httpStatus.UNAUTHORIZED,
      "Token is not authorized : token!!!"
    );
    return next(apiError);
  }
  req.user = user;
  next();
});

export { auth };
